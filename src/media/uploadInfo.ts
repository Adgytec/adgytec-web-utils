import { v7 as uuidv7 } from "uuid";
import type { NewUploadInfos, NewUploadInfo, MediaUploadInfo } from "./types";

export const newUploadInfo: NewUploadInfo = (item) => {
  return {
    id: uuidv7(),
    name: item.name,
    size: item.size,
  };
};

export const newUploadInfos: NewUploadInfos = (items) => {
  const infos: MediaUploadInfo[] = [];

  for (const item of items) {
    infos.push(newUploadInfo(item));
  }

  return infos;
};
