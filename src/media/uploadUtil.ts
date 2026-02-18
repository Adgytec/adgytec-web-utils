import { Queue } from "@datastructures-js/queue";
import { BaseError, parseError } from "../errors";
import { decodeAPIResponse } from "../response";
import { MultipartUtil } from "./multipartUtil";
import type {
  LifecycleHandler,
  MultipartUploadedPartDetails,
  Retry,
  UploadDetails,
} from "./types";

export class Upload {
  #items: UploadDetails[];
  #lifecycleHandler: LifecycleHandler;
  #concurrentUploads: number;
  #retryLimit: number;
  #retryQueue: Queue<Retry>;

  constructor(uploadItems: UploadDetails[], handler: LifecycleHandler);
  constructor(
    uploadItems: UploadDetails[],
    handler: LifecycleHandler,
    concurrentUploads: number,
    retryLimit: number,
  );
  constructor(
    uploadItems: UploadDetails[],
    handler: LifecycleHandler,
    concurrentUploads: number = 4,
    retryLimit: number = 3,
  ) {
    this.#items = uploadItems;
    this.#lifecycleHandler = handler;
    this.#concurrentUploads = concurrentUploads;
    this.#retryLimit = retryLimit;
    this.#retryQueue = new Queue();
  }

  async init() {
    this.#lifecycleHandler.init(this.#items);
  }

  async #blobUpload(uploadURL: string, blob: Blob): Promise<Response> {
    return await fetch(uploadURL, {
      method: "PUT",
      body: blob,
    });
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
        "Content-type": "application/json",
      },
    });
    await decodeAPIResponse(apiRes);
  }

  async #completeSinglepartUpload(callback: string) {
    try {
      await this.#completeUpload(callback);
    } catch (err) {
      console.error("failed to complete singlepart upload: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "singlepart-complete",
        retryCount: 1,
        successCallbackURL: callback,
      });
    }
  }

  async #completeMultipartUpload(
    callback: string,
    multipartObj: MultipartUtil,
  ) {
    try {
      await this.#completeUpload(callback, multipartObj.list());
    } catch (err) {
      console.error("failed to complete multipart upload: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "multipart-complete",
        retryCount: 1,
        successCallbackURL: callback,
        multipartObj: multipartObj,
      });
    }
  }

  async *#generateTasks(): AsyncGenerator<() => Promise<void>> {
    for (const item of this.#items) {
      if (item.uploadType === "singlepart") {
        yield async () => {
          try {
            const res = await this.#blobUpload(item.presignPut, item.file);
            if (!res.ok) {
              throw new BaseError("can't upload file blob");
            }

            await this.#completeSinglepartUpload(
              item.singlepartSuccessCallback,
            );
          } catch (err) {
            console.error(
              "failed to singlepart upload item: ",
              parseError(err),
            );

            // complete retry is handled in complete upload action only
            this.#retryQueue.enqueue({
              type: "singlepart-upload",
              retryCount: 1,
              uploadURL: item.presignPut,
              blob: item.file,
            });
          }
        };
        continue;
      }

      // multipart
      const multipartObj = new MultipartUtil(item.multipartPresignPart.length);

      // file slice byte range
      let startByte = 0;
      let endByte = 0;

      for (const partDetails of item.multipartPresignPart) {
        endByte += partDetails.partSize;

        yield async () => {
          try {
            const res = await this.#blobUpload(
              partDetails.presignPut,
              item.file.slice(startByte, endByte),
            );
            if (!res.ok) {
              throw new BaseError("can't upload file blob");
            }

            const etag = res.headers.get("ETag");
            if (!etag) {
              throw new BaseError("missing etag");
            }

            multipartObj.add({
              partNumber: partDetails.partNumber,
              etag: etag,
            });

            if (multipartObj.allPartsUploaded()) {
              await this.#completeMultipartUpload(
                item.multipartSuccessCallback,
                multipartObj,
              );
            }
          } catch (err) {
            console.error("failed to upload multipart part: ", parseError(err));
            this.#retryQueue.enqueue({
              type: "multipart-part-upload",
              retryCount: 1,
              uploadURL: partDetails.presignPut,
              multipartObj: multipartObj,
              blob: item.file,
              startByte: startByte,
              endByte: endByte,
            });
          }
        };

        startByte = endByte;
      }
    }
  }
}
