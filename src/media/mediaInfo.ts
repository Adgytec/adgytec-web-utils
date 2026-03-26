import { v7 as uuidv7 } from "uuid";
import { MediaItemsLimit, MediaUploadLimit } from "../constants";
import {
    newMediaItemsLimitExceedError,
    newMediaTooLargeError,
} from "../errorSchema";
import type { NewMediaInfo, NewMediaInfos } from "./types";

export const newMediaInfo: NewMediaInfo = (item) => {
    if (item.size > MediaUploadLimit) {
        newMediaTooLargeError(item.name, item.size, MediaUploadLimit);
    }

    return {
        id: uuidv7(),
        name: item.name,
        size: item.size,
        file: item,
    };
};

export const newMediaInfos: NewMediaInfos = (items) => {
    if (items.length > MediaItemsLimit) {
        newMediaItemsLimitExceedError(items.length, MediaItemsLimit);
    }

    return items.map(newMediaInfo);
};
