import z from "zod";
import {
    INVALID_MULTIPART_NUMBER,
    MEDIA_OBJECT_NOT_FOUND,
    MEDIA_TOO_LARGE,
    MEDIA_ITEMS_LIMIT_EXCEEDED,
    UPLOAD_ALREADY_COMPLETED,
    UNSUPPORTED_OBJECT_UPLOADED,
    COMPLETE_MULTIPART_UPLOAD_CALLED_TOO_SOON,
} from "../errorCodes";
import type { ErrorSchemaType } from "./types";

export const invalidMultipartNumberSchema = z.object({
    code: z.literal(INVALID_MULTIPART_NUMBER),
});

export const mediaObjectNotFoundSchema = z.object({
    code: z.literal(MEDIA_OBJECT_NOT_FOUND),
});

export const mediaTooLargeSchema = z.object({
    code: z.literal(MEDIA_TOO_LARGE),
    details: z.object({
        mediaID: z.uuidv7(),
        currentSize: z.int(),
        maxSupportedSize: z.int(),
    }),
});

export const mediaItemsLimitExceededSchema = z.object({
    code: z.literal(MEDIA_ITEMS_LIMIT_EXCEEDED),
    details: z.object({
        currentLength: z.int(),
        maxItemsSupported: z.int(),
    }),
});

export const uploadAlreadyCompletedSchema = z.object({
    code: z.literal(UPLOAD_ALREADY_COMPLETED),
});

export const unsupportedObjectUploadedSchema = z.object({
    code: z.literal(UNSUPPORTED_OBJECT_UPLOADED),
});

export const completeMultipartUploadCalledTooSoonSchema = z.object({
    code: z.literal(COMPLETE_MULTIPART_UPLOAD_CALLED_TOO_SOON),
});

export const defaultMediaSchemas: ErrorSchemaType[] = [
    invalidMultipartNumberSchema,
    mediaObjectNotFoundSchema,
    mediaTooLargeSchema,
    mediaItemsLimitExceededSchema,
    uploadAlreadyCompletedSchema,
    unsupportedObjectUploadedSchema,
    completeMultipartUploadCalledTooSoonSchema,
];
