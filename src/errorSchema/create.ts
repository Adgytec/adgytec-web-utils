import type z from "zod";
import { mediaCodes } from "../errorCodes";
import { ApplicationError } from "../errors";
import type {
    mediaItemsLimitExceededSchema,
    mediaTooLargeSchema,
} from "./media";

type MediaItemsLimitExceeded = z.infer<typeof mediaItemsLimitExceededSchema>;

export function newMediaItemsLimitExceedError(
    currentLength: number,
    maxItemsSupported: number
): never {
    const errObj: MediaItemsLimitExceeded = {
        code: mediaCodes.mediaItemsLimitExceeded,
        currentLength,
        maxItemsSupported,
    };
    throw new ApplicationError(errObj.code, errObj);
}

type MediaTooLarge = z.infer<typeof mediaTooLargeSchema>;

export function newMediaTooLargeError(
    fileName: string,
    currentSize: number,
    maxSupportedSize: number
): never {
    // use file as mediaID to handle client side error
    const errObj: MediaTooLarge = {
        code: mediaCodes.mediaTooLarge,
        mediaID: fileName,
        currentSize,
        maxSupportedSize,
    };
    throw new ApplicationError(errObj.code, errObj);
}
