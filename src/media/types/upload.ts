import type { MultipartUtil } from "../multipartUtil";
import type { LifecycleHandler } from "./lifecycle";
import type { UploadDetails } from "./uploadDetails";

export type UploadItem = (
  items: UploadDetails,
  lifecycleHandler: LifecycleHandler,
) => Promise<void>;

export type UploadItems = (
  items: UploadDetails[],
  lifecycleHandler: LifecycleHandler,
) => Promise<void>;

export type MultipartUploadedPartDetails = {
  etag: string;
  partNumber: number;
};

type SinglepartUploadRetry = {
  type: "singlepart-upload";
  id: string;
  uploadURL: string;
  blob: Blob;
};

type SinglepartCompleteRetry = {
  type: "singlepart-complete";
  id: string;
  successCallbackURL: string;
};

type MultipartPartUploadRetry = {
  type: "multipart-part-upload";
  uploadURL: string;
  multipartObj: MultipartUtil;
  partNumber: number;
  blob: Blob;
  startByte: number;
  endByte: number;
};

type MultipartCompleteRetry = {
  type: "multipart-complete";
  successCallbackURL: string;
  multipartObj: MultipartUtil;
};

type RetryAction =
  | SinglepartUploadRetry
  | SinglepartCompleteRetry
  | MultipartPartUploadRetry
  | MultipartCompleteRetry;

export type Retry = RetryAction & {
  retryCount: number;
};
