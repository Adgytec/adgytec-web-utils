import type { UploadItems, UploadItem } from "./types";
import { Upload } from "./uploadUtil";

export const uploadItem: UploadItem = async (item, handler, limits) => {
    await uploadItems([item], handler, limits);
};

export const uploadItems: UploadItems = async (items, handler, limits) => {
    const uploadObj = new Upload(items, handler, limits);
    await uploadObj.init();
};
