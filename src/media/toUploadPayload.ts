import type { ToUploadPayload, ToUploadPayloads } from "./types";

export const toUploadPayload: ToUploadPayload = (item) => {
    return {
        id: item.id,
        size: item.size,
        name: item.name,
    };
};

export const toUploadPayloads: ToUploadPayloads = (items) => {
    return items.map(toUploadPayload);
};
