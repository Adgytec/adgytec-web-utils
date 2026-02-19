import type { MultipartUtil } from "../multipartUtil";
import type { SinglepartUtil } from "../singlepartUtil";
import type { LifecycleHandler } from "./lifecycle";
import type { UploadDetails } from "./uploadDetails";

export type UploadLimits = {
    concurrentUploads: number;
    retryLimit: number;
};

export type UploadItem = (
    item: UploadDetails,
    lifecycleHandler: LifecycleHandler,
    uploadLimits?: UploadLimits
) => Promise<void>;

export type UploadItems = (
    items: UploadDetails[],
    lifecycleHandler: LifecycleHandler,
    uploadLimits?: UploadLimits
) => Promise<void>;

export type MultipartUploadedPartDetails = {
    etag: string;
    partNumber: number;
};

type SinglepartUploadRetry = {
    type: "singlepart-upload";
    singlepartObj: SinglepartUtil;
};

type SinglepartCompleteRetry = {
    type: "singlepart-complete";
    singlepartObj: SinglepartUtil;
};

export type MultipartPartInfo = {
    uploadURL: string;
    partNumber: number;
    startByte: number;
    endByte: number;
};

type MultipartPartUploadRetry = {
    type: "multipart-part-upload";
    multipartObj: MultipartUtil;
    partInfo: MultipartPartInfo;
};

type MultipartCompleteRetry = {
    type: "multipart-complete";
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
