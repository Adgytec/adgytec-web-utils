import type { UploadItems, UploadItem } from "./types";
import { Upload } from "./uploadUtil";

export const uploadItem: UploadItem = async (
    item,
    handler,
    limits,
    languageTag
) => {
    await uploadItems([item], handler, limits, languageTag);
};

export const uploadItems: UploadItems = async (
    items,
    handler,
    limits,
    languageTag
) => {
    const uploadObj = new Upload(items, handler, limits, languageTag);
    await uploadObj.init();
};
