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
