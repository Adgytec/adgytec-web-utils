import { BaseError, parseError } from "../errors";
import { decodeAPIResponse } from "../response";
import { MultipartUtil } from "./multipartUtil";
import type {
  LifecycleHandler,
  MultipartUploadedPartDetails,
  UploadDetails,
} from "./types";

export class Upload {
  #items: UploadDetails[];
  #lifecycleHandler: LifecycleHandler;
  #concurrentUploads: number;
  #retryLimit: number;

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

  async *#generateTasks(): AsyncGenerator<() => Promise<void>> {
    for (const item of this.#items) {
      if (item.uploadType === "singlepart") {
        yield async () => {
          try {
            const res = await this.#blobUpload(item.presignPut, item.file);
            if (!res.ok) {
              throw new BaseError("can't upload file blob");
            }

            await this.#completeUpload(item.singlepartSuccessCallback);
          } catch (err) {
            // TODO: add to retry queue
            console.error("failed to upload: ", parseError(err));
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
          } catch (err) {
            // TODO: add to retry queue
            console.error("failed to upload: ", parseError(err));
          }
        };

        startByte = endByte;
      }

      // complete multipart
      if (!multipartObj.allPartsUploaded()) {
        continue;
      }

      yield async () => {
        try {
          await this.#completeUpload(
            item.multipartSuccessCallback,
            multipartObj.list(),
          );
        } catch (err) {
          // TODO: add to retry queue
          console.error("failed to upload: ", parseError(err));
        }
      };
    }
  }
}
