import type { UploadDetailsAPIRes } from "./apiResponse";
import type { MediaInfo } from "./mediaInfo";

export type UploadDetails = UploadDetailsAPIRes & {
    file: File;
    size: number;
};

export type NewUploadDetails = (
    mediaInfo: MediaInfo,
    apiResponse: UploadDetailsAPIRes
) => UploadDetails;

export type NewUploadsDetails = (
    mediaInfos: MediaInfo[],
    apiResponse: UploadDetailsAPIRes[]
) => UploadDetails[];
