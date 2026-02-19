import type { MediaInfo } from "./mediaInfo";

export type MediaUploadPayload = Omit<MediaInfo, "file">;

export type ToUploadPayload = (item: MediaInfo) => MediaUploadPayload;

export type ToUploadPayloads = (items: MediaInfo[]) => MediaUploadPayload[];
