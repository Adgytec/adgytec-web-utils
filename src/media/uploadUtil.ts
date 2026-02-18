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
} from "./types";
import { SinglepartUtil } from "./singlepartUtil";

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

  async #singlepartUpload(
    singlepartObj: SinglepartUtil,
    retryCount: number = 0,
  ) {
    try {
      const res = await this.#blobUpload(
        singlepartObj.uploadURL,
        singlepartObj.blob,
      );
      if (!res.ok) {
        throw new BaseError("can't upload file blob");
      }
    } catch (err) {
      console.error("failed to upload item: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "singlepart-upload",
        retryCount: retryCount + 1,
        singlepartObj: singlepartObj,
      });
    }
  }

  async #multipartUpload(
    multipartObj: MultipartUtil,
    partInfo: MultipartPartInfo,
    retryCount: number = 0,
  ) {
    if (multipartObj.contains(partInfo.partNumber)) {
      return;
    }

    try {
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
    } catch (err) {
      console.error("failed to upload multipart part: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "multipart-part-upload",
        retryCount: retryCount + 1,
        multipartObj: multipartObj,
        partInfo: partInfo,
      });
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
        "Content-type": "application/json",
      },
    });
    await decodeAPIResponse(apiRes);
  }

  async #completeSinglepartUpload(
    singlepartObj: SinglepartUtil,
    retryCount: number = 0,
  ) {
    try {
      await this.#completeUpload(singlepartObj.completeURL);
    } catch (err) {
      console.error("failed to complete singlepart upload: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "singlepart-complete",
        retryCount: retryCount + 1,
        singlepartObj: singlepartObj,
      });
    }
  }

  async #completeMultipartUpload(
    multipartObj: MultipartUtil,
    retryCount: number = 0,
  ) {
    try {
      await this.#completeUpload(multipartObj.completeURL, multipartObj.list);
    } catch (err) {
      console.error("failed to complete multipart upload: ", parseError(err));
      this.#retryQueue.enqueue({
        type: "multipart-complete",
        retryCount: retryCount + 1,
        multipartObj: multipartObj,
      });
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

          await this.#completeSinglepartUpload(singlepartObj);
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

          if (multipartObj.canComplete) {
            await this.#completeMultipartUpload(multipartObj);
          }
        };

        startByte = endByte;
      }
    }
  }
}
