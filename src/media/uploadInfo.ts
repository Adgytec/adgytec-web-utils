import { v7 as uuidv7 } from "uuid";
import type { NewUploadInfos, NewUploadInfo } from "./types";

export const newUploadInfo: NewUploadInfo = (item) => {
  return {
    id: uuidv7(),
    name: item.name,
    size: item.size,
  };
};

export const newUploadInfos: NewUploadInfos = (items) => {
  return items.map(newUploadInfo);
};
