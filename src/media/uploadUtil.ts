import { Queue } from "@datastructures-js/queue";
import { BaseError, parseError } from "../errors";
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
  #retryNotifier?: () => void;
  #activeTasks: number;

  constructor(
    uploadItems: UploadDetails[],
    handler: LifecycleHandler,
    limits: UploadLimits = defaultUploadLimit,
  ) {
    this.#items = uploadItems;
    this.#lifecycleHandler = handler;
    this.#concurrentUploads = limits.concurrentUploads;
    this.#retryLimit = limits.retryLimit;
    this.#retryQueue = new Queue();
    this.#activeTasks = 0;
  }

  #canRetry(currentCount: number): boolean {
    return currentCount < this.#retryLimit;
  }

  #retryNotify() {
    this.#retryNotifier?.();
    this.#retryNotifier = undefined;
  }

  #addRetry(task: Retry) {
    this.#retryQueue.enqueue(task);
    this.#retryNotify();
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

    await Promise.all(running);
    this.#lifecycleHandler.completed();
  }

  async #blobUpload(uploadURL: string, blob: Blob): Promise<Response> {
    return await fetch(uploadURL, {
      method: "PUT",
      body: blob,
    });
  }

  async #singlepartUpload(
    singlepartObj: SinglepartUtil,
    retryCount: number = 0,
  ) {
    if (singlepartObj.canComplete) {
      return;
    }

    try {
      this.#activeTasks++;
      const res = await this.#blobUpload(
        singlepartObj.uploadURL,
        singlepartObj.blob,
      );
      if (!res.ok) {
        throw new BaseError("can't upload file blob");
      }

      singlepartObj.allowComplete();
      await this.#completeSinglepartUpload(singlepartObj);
    } catch (err) {
      const parsedErr = parseError(err);

      if (this.#canRetry(retryCount)) {
        this.#lifecycleHandler.uploadRetrying(singlepartObj.id);
        this.#addRetry({
          type: "singlepart-upload",
          retryCount: retryCount + 1,
          singlepartObj: singlepartObj,
        });
      } else {
        this.#lifecycleHandler.failed(singlepartObj.id, parsedErr);
      }
    } finally {
      this.#activeTasks--;
      this.#retryNotify();
    }
  }

  async #multipartUpload(
    multipartObj: MultipartUtil,
    partInfo: MultipartPartInfo,
    retryCount: number = 0,
  ) {
    if (multipartObj.failed || multipartObj.contains(partInfo.partNumber)) {
      return;
    }

    try {
      this.#activeTasks++;
      const res = await this.#blobUpload(
        partInfo.uploadURL,
        multipartObj.blob.slice(partInfo.startByte, partInfo.endByte),
      );
      if (!res.ok) {
        throw new BaseError("can't upload file blob");
      }

      const etag = res.headers.get("ETag");
      if (!etag) {
        throw new BaseError("missing etag");
      }

      multipartObj.add({
        partNumber: partInfo.partNumber,
        etag: etag,
      });

      this.#lifecycleHandler.multipartPartUploaded(
        multipartObj.id,
        multipartObj.uploadedPartsCount,
        multipartObj.totalPartsCount,
      );

      if (!multipartObj.canComplete) return;
      await this.#completeMultipartUpload(multipartObj);
    } catch (err) {
      const parsedErr = parseError(err);

      if (this.#canRetry(retryCount)) {
        this.#lifecycleHandler.multipartPartUploadRetrying(
          multipartObj.id,
          partInfo.partNumber,
        );

        this.#addRetry({
          type: "multipart-part-upload",
          retryCount: retryCount + 1,
          multipartObj: multipartObj,
          partInfo: partInfo,
        });
      } else {
        multipartObj.fail();
        this.#lifecycleHandler.failed(multipartObj.id, parsedErr);
      }
    } finally {
      this.#activeTasks--;
      this.#retryNotify();
    }
  }

  async #completeUpload(
    completeURL: string,
    body?: MultipartUploadedPartDetails[],
  ) {
    let reqBody = undefined;
    if (body) {
      reqBody = JSON.stringify({
        partsInfo: body,
      });
    }

    const apiRes = await fetch(completeURL, {
      method: "POST",
      body: reqBody,
      headers: {
        "Content-Type": "application/json",
      },
    });
    await decodeAPIResponse(apiRes);
  }

  async #completeSinglepartUpload(
    singlepartObj: SinglepartUtil,
    retryCount: number = 0,
  ) {
    if (!singlepartObj.canComplete) {
      return;
    }

    try {
      this.#activeTasks++;
      await this.#completeUpload(singlepartObj.completeURL);

      this.#lifecycleHandler.itemUploaded(singlepartObj.id);
    } catch (err) {
      const parsedErr = parseError(err);

      if (this.#canRetry(retryCount)) {
        this.#lifecycleHandler.uploadRetrying(singlepartObj.id);
        this.#addRetry({
          type: "singlepart-complete",
          retryCount: retryCount + 1,
          singlepartObj: singlepartObj,
        });
      } else {
        this.#lifecycleHandler.failed(singlepartObj.id, parsedErr);
      }
    } finally {
      this.#activeTasks--;
      this.#retryNotify();
    }
  }

  async #completeMultipartUpload(
    multipartObj: MultipartUtil,
    retryCount: number = 0,
  ) {
    if (!multipartObj.tryStartComplete()) {
      return;
    }

    try {
      this.#activeTasks++;
      await this.#completeUpload(multipartObj.completeURL, multipartObj.list);

      this.#lifecycleHandler.itemUploaded(multipartObj.id);
    } catch (err) {
      multipartObj.resetComplete();

      const parsedErr = parseError(err);

      if (this.#canRetry(retryCount)) {
        this.#lifecycleHandler.uploadRetrying(multipartObj.id);
        this.#addRetry({
          type: "multipart-complete",
          retryCount: retryCount + 1,
          multipartObj: multipartObj,
        });
      } else {
        multipartObj.fail();
        this.#lifecycleHandler.failed(multipartObj.id, parsedErr);
      }
    } finally {
      this.#activeTasks--;
      this.#retryNotify();
    }
  }

  async *#generateTasks(): AsyncGenerator<() => Promise<void>> {
    for (const item of this.#items) {
      if (item.uploadType === "singlepart") {
        const singlepartObj = new SinglepartUtil(
          item.mediaID,
          item.file,
          item.presignPut,
          item.singlepartSuccessCallback,
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
        item.multipartPresignPart.length,
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

    // TODO: will handle retries in better way in next pr
    // handle retries
    while (this.#activeTasks > 0 || !this.#retryQueue.isEmpty()) {
      if (!this.#retryQueue.isEmpty()) {
        const task = this.#retryQueue.dequeue()!;

        switch (task.type) {
          case "singlepart-upload":
            yield async () => {
              await this.#singlepartUpload(task.singlepartObj, task.retryCount);
            };
            break;
          case "singlepart-complete":
            yield async () => {
              await this.#completeSinglepartUpload(
                task.singlepartObj,
                task.retryCount,
              );
            };
            break;
          case "multipart-part-upload":
            yield async () => {
              await this.#multipartUpload(
                task.multipartObj,
                task.partInfo,
                task.retryCount,
              );
            };
            break;
          case "multipart-complete":
            yield async () => {
              await this.#completeMultipartUpload(
                task.multipartObj,
                task.retryCount,
              );
            };
            break;
        }
        continue;
      }

      // wait for new retry
      await new Promise<void>((resolve) => {
        this.#retryNotifier = resolve;
      });
    }
  }
}
