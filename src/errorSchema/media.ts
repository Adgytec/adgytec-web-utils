import z from "zod";
import { mediaCodes } from "../errorCodes";

export const invalidMultipartNumberSchema = z.object({
    code: z.literal(mediaCodes.invalidMultipartNumber),
});

export const mediaObjectNotFoundSchema = z.object({
    code: z.literal(mediaCodes.mediaObjectNotFound),
});

export const mediaTooLargeSchema = z.object({
    code: z.literal(mediaCodes.mediaTooLarge),
    details: z.object({
        mediaID: z.uuidv7(),
        currentSize: z.int(),
        maxSupportedSize: z.int(),
    }),
});

export const mediaItemsLimitExceededSchema = z.object({
    code: z.literal(mediaCodes.mediaItemsLimitExceeded),
    details: z.object({
        currentLength: z.int(),
        maxItemsSupported: z.int(),
    }),
});

export const uploadAlreadyCompletedSchema = z.object({
    code: z.literal(mediaCodes.uploadAlreadyCompleted),
});

export const unsupportedObjectUploadedSchema = z.object({
    code: z.literal(mediaCodes.unsupportedObjectUploaded),
});

export const completeMultipartUploadCalledTooSoonSchema = z.object({
    code: z.literal(mediaCodes.completeMultipartUploadCalledTooSoon),
});
