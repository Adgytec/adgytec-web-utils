import type { UploadItems, UploadItem } from "./types";
import { Upload } from "./uploadUtil";

export const uploadItem: UploadItem = async (item, handler) => {
  uploadItems([item], handler);
};

export const uploadItems: UploadItems = async (items, handler) => {
  const uploadObj = new Upload(items, handler);
  await uploadObj.init();
};
