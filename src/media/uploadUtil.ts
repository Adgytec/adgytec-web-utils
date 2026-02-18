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

  async #completeSinglepartUpload(callback: string, retryCount: number = 0) {
    try {
      await this.#completeUpload(callback);
    } catch (err) {
      console.error("failed to complete singlepart upload: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "singlepart-complete",
        retryCount: retryCount + 1,
        successCallbackURL: callback,
      });
    }
  }

  async #completeMultipartUpload(
    callback: string,
    multipartObj: MultipartUtil,
    retryCount: number = 0,
  ) {
    try {
      await this.#completeUpload(callback, multipartObj.list());
    } catch (err) {
      console.error("failed to complete multipart upload: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "multipart-complete",
        retryCount: retryCount + 1,
        successCallbackURL: callback,
        multipartObj: multipartObj,
      });
    }
  }

  async #singlepartUpload(
    uploadURL: string,
    blob: Blob,
    retryCount: number = 0,
  ) {
    try {
      const res = await this.#blobUpload(uploadURL, blob);
      if (!res.ok) {
        throw new BaseError("can't upload file blob");
      }
    } catch (err) {
      console.error("failed to upload item: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "singlepart-upload",
        retryCount: retryCount + 1,
        uploadURL: uploadURL,
        blob: blob,
      });
    }
  }

  async #multipartUpload(
    multipartObj: MultipartUtil,
    partNumber: number,
    uploadURL: string,
    blob: Blob,
    startByte: number,
    endByte: number,
    retryCount: number = 0,
  ) {
    try {
      const res = await this.#blobUpload(
        uploadURL,
        blob.slice(startByte, endByte),
      );
      if (!res.ok) {
        throw new BaseError("can't upload file blob");
      }

      const etag = res.headers.get("ETag");
      if (!etag) {
        throw new BaseError("missing etag");
      }

      multipartObj.add({
        partNumber: partNumber,
        etag: etag,
      });
    } catch (err) {
      console.error("failed to upload multipart part: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "multipart-part-upload",
        retryCount: retryCount + 1,
        uploadURL: uploadURL,
        multipartObj: multipartObj,
        partNumber: partNumber,
        blob: blob,
        startByte: startByte,
        endByte: endByte,
      });
    }
  }

  async *#generateTasks(): AsyncGenerator<() => Promise<void>> {
    for (const item of this.#items) {
      if (item.uploadType === "singlepart") {
        yield async () => {
          await this.#singlepartUpload(item.presignPut, item.file);
          await this.#completeSinglepartUpload(item.singlepartSuccessCallback);
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
          await this.#multipartUpload(
            multipartObj,
            partDetails.partNumber,
            partDetails.presignPut,
            item.file,
            startByte,
            endByte,
          );

          if (multipartObj.allPartsUploaded()) {
            await this.#completeMultipartUpload(
              item.multipartSuccessCallback,
              multipartObj,
            );
          }
        };

        startByte = endByte;
      }
    }
  }
}
