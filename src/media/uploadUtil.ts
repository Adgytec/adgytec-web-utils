import { Queue } from "@datastructures-js/queue";
import { ApplicationError, BaseError } from "../errors";
import { decodeAPIResponse } from "../response";
import { MultipartUtil } from "./multipartUtil";
import type {
    LifecycleHandler,
    MultipartPartInfo,
    MultipartUploadedPartDetails,
    Retry,
    UploadDetails,
    UploadLimits,
} from "./types";
import { SinglepartUtil } from "./singlepartUtil";
import {
    httpMethods,
    httpReqHeaders,
    httpRequestCredentials,
} from "../constants";
import { mediaCodes } from "../errorCodes";

const defaultUploadLimit: UploadLimits = {
    concurrentUploads: 4,
    retryLimit: 3,
};

export class Upload {
    #items: UploadDetails[];
    #lifecycleHandler: LifecycleHandler;
    #concurrentUploads: number;
    #retryLimit: number;
    #retryQueue: Queue<Retry>;
    #languageTag?: string;

    constructor(
        uploadItems: UploadDetails[],
        handler: LifecycleHandler,
        limits: UploadLimits = defaultUploadLimit,
        languageTag?: string
    ) {
        this.#items = uploadItems;
        this.#lifecycleHandler = handler;
        this.#concurrentUploads = limits.concurrentUploads;
        this.#retryLimit = limits.retryLimit;
        this.#retryQueue = new Queue();
        this.#languageTag = languageTag;
    }

    #canRetry(currentCount: number): boolean {
        return currentCount < this.#retryLimit;
    }

    #addRetry(task: Retry) {
        this.#retryQueue.enqueue(task);
    }

    async init() {
        this.#lifecycleHandler.init(this.#items);

        const running = new Set<Promise<void>>();
        for await (const task of this.#generateTasks()) {
            const p = task().finally(() => running.delete(p));
            running.add(p);

            if (running.size >= this.#concurrentUploads) {
                await Promise.race(running);
            }
        }

        // wait for all initial task to complete
        await Promise.all(running);

        // complete retry action
        await this.#handleRetries();

        this.#lifecycleHandler.completed();
    }

    async #blobUpload(uploadURL: string, blob: Blob): Promise<Response> {
        return await fetch(uploadURL, {
            method: httpMethods.put,
            body: blob,
        });
    }

    async #singlepartUpload(
        singlepartObj: SinglepartUtil,
        retryCount: number = 0
    ) {
        if (singlepartObj.canComplete) {
            return;
        }

        try {
            const res = await this.#blobUpload(
                singlepartObj.uploadURL,
                singlepartObj.blob
            );
            if (!res.ok) {
                throw new ApplicationError(mediaCodes.singlepartUploadFailed, {
                    mediaID: singlepartObj.id,
                });
            }

            singlepartObj.allowComplete();
            await this.#completeSinglepartUpload(singlepartObj);
        } catch (err) {
            if (this.#canRetry(retryCount)) {
                this.#lifecycleHandler.uploadRetrying(singlepartObj.id);
                this.#addRetry({
                    type: "singlepart-upload",
                    retryCount: retryCount + 1,
                    singlepartObj: singlepartObj,
                });
            } else {
                this.#lifecycleHandler.failed(singlepartObj.id, err);
            }
        }
    }

    async #multipartUpload(
        multipartObj: MultipartUtil,
        partInfo: MultipartPartInfo,
        retryCount: number = 0
    ) {
        if (multipartObj.failed || multipartObj.contains(partInfo.partNumber)) {
            return;
        }

        try {
            const res = await this.#blobUpload(
                partInfo.uploadURL,
                multipartObj.blob.slice(partInfo.startByte, partInfo.endByte)
            );
            if (!res.ok) {
                throw new ApplicationError(
                    mediaCodes.multipartPartUploadFailed,
                    {
                        mediaID: multipartObj.id,
                        partNumber: partInfo.partNumber,
                    }
                );
            }

            const etag = res.headers.get("ETag");
            if (!etag) {
                throw new ApplicationError(mediaCodes.missingETagValue, {
                    mediaID: multipartObj.id,
                    partNumber: partInfo.partNumber,
                });
            }

            multipartObj.add({
                partNumber: partInfo.partNumber,
                etag: etag,
            });

            this.#lifecycleHandler.multipartPartUploaded(
                multipartObj.id,
                multipartObj.uploadedPartsCount,
                multipartObj.totalPartsCount
            );

            if (!multipartObj.canComplete) return;
            await this.#completeMultipartUpload(multipartObj);
        } catch (err) {
            if (this.#canRetry(retryCount)) {
                this.#lifecycleHandler.multipartPartUploadRetrying(
                    multipartObj.id,
                    partInfo.partNumber
                );

                this.#addRetry({
                    type: "multipart-part-upload",
                    retryCount: retryCount + 1,
                    multipartObj: multipartObj,
                    partInfo: partInfo,
                });
            } else {
                multipartObj.fail();
                this.#lifecycleHandler.failed(multipartObj.id, err);
            }
        }
    }

    async #completeUpload(
        completeURL: string,
        body?: MultipartUploadedPartDetails[]
    ) {
        let reqBody: BodyInit | undefined = undefined;
        let headers: HeadersInit | undefined = undefined;
        if (body) {
            reqBody = JSON.stringify({
                partsInfo: body,
            });

            headers = {
                [httpReqHeaders.contentType.key]:
                    httpReqHeaders.contentType.valueApplicationJSON,
            };
        }

        if (this.#languageTag) {
            headers = headers || {};
            headers[httpReqHeaders.userLocale.key] = this.#languageTag;
        }

        const apiRes = await fetch(completeURL, {
            method: httpMethods.post,
            body: reqBody,
            headers: headers,
            credentials: httpRequestCredentials.include,
        });
        await decodeAPIResponse(apiRes);
    }

    async #completeSinglepartUpload(
        singlepartObj: SinglepartUtil,
        retryCount: number = 0
    ) {
        if (!singlepartObj.canComplete) {
            return;
        }

        try {
            await this.#completeUpload(singlepartObj.completeURL);

            this.#lifecycleHandler.itemUploaded(singlepartObj.id);
        } catch (err) {
            if (this.#canRetry(retryCount)) {
                this.#lifecycleHandler.uploadRetrying(singlepartObj.id);
                this.#addRetry({
                    type: "singlepart-complete",
                    retryCount: retryCount + 1,
                    singlepartObj: singlepartObj,
                });
            } else {
                this.#lifecycleHandler.failed(singlepartObj.id, err);
            }
        }
    }

    async #completeMultipartUpload(
        multipartObj: MultipartUtil,
        retryCount: number = 0
    ) {
        if (!multipartObj.tryStartComplete()) {
            return;
        }

        try {
            await this.#completeUpload(
                multipartObj.completeURL,
                multipartObj.list
            );

            this.#lifecycleHandler.itemUploaded(multipartObj.id);
        } catch (err) {
            multipartObj.resetComplete();

            if (this.#canRetry(retryCount)) {
                this.#lifecycleHandler.uploadRetrying(multipartObj.id);
                this.#addRetry({
                    type: "multipart-complete",
                    retryCount: retryCount + 1,
                    multipartObj: multipartObj,
                });
            } else {
                multipartObj.fail();
                this.#lifecycleHandler.failed(multipartObj.id, err);
            }
        }
    }

    async *#generateTasks(): AsyncGenerator<() => Promise<void>> {
        for (const item of this.#items) {
            if (item.uploadType === "singlepart") {
                const singlepartObj = new SinglepartUtil(
                    item.mediaID,
                    item.file,
                    item.presignPut,
                    item.singlepartSuccessCallback
                );

                yield async () => {
                    await this.#singlepartUpload(singlepartObj);
                };
                continue;
            }

            // multipart
            const multipartObj = new MultipartUtil(
                item.mediaID,
                item.file,
                item.multipartSuccessCallback,
                item.multipartPresignPart.length
            );

            // file slice byte range
            let startByte = 0;
            let endByte = 0;

            for (const partDetails of item.multipartPresignPart) {
                endByte += partDetails.partSize;

                const partInfo: MultipartPartInfo = {
                    partNumber: partDetails.partNumber,
                    uploadURL: partDetails.presignPut,
                    startByte: startByte,
                    endByte: endByte,
                };

                yield async () => {
                    await this.#multipartUpload(multipartObj, partInfo);
                };

                startByte = endByte;
            }
        }
    }

    #retryTask(task: Retry): Promise<void> {
        // promise assignment
        switch (task.type) {
            case "singlepart-upload":
                return this.#singlepartUpload(
                    task.singlepartObj,
                    task.retryCount
                );
            case "singlepart-complete":
                return this.#completeSinglepartUpload(
                    task.singlepartObj,
                    task.retryCount
                );
            case "multipart-part-upload":
                return this.#multipartUpload(
                    task.multipartObj,
                    task.partInfo,
                    task.retryCount
                );
            case "multipart-complete":
                return this.#completeMultipartUpload(
                    task.multipartObj,
                    task.retryCount
                );
            default:
                const _exhaustiveCheck: never = task;

                // This will cause a compile-time error if a new task type is added but not handled here.
                throw new BaseError(
                    `Unhandled retry task type: ${(_exhaustiveCheck as any).type}`
                );
        }
    }

    async #handleRetries() {
        const running = new Set<Promise<void>>();

        while (true) {
            if (this.#retryQueue.isEmpty()) break;

            while (!this.#retryQueue.isEmpty()) {
                const task = this.#retryQueue.dequeue()!;

                let p: Promise<void> = this.#retryTask(task).finally(() =>
                    running.delete(p)
                );
                running.add(p);

                if (running.size >= this.#concurrentUploads) {
                    await Promise.race(running);
                }
            }

            await Promise.all(running);
        }
    }
}
