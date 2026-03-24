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
    mediaID: z.string(),
    currentSize: z.int(),
    maxSupportedSize: z.int(),
});

export const mediaItemsLimitExceededSchema = z.object({
    code: z.literal(mediaCodes.mediaItemsLimitExceeded),
    currentLength: z.int(),
    maxItemsSupported: z.int(),
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

export const singlepartUploadFailedSchema = z.object({
    code: z.literal(mediaCodes.singlepartUploadFailed),
    mediaID: z.uuidv7(),
});

export const multipartPartUploadFailedSchema = z.object({
    code: z.literal(mediaCodes.multipartPartUploadFailed),
    mediaID: z.uuidv7(),
    partNumber: z.int(),
});

export const missingETagValueSchema = z.object({
    code: z.literal(mediaCodes.missingETagValue),
    mediaID: z.uuidv7(),
    partNumber: z.int(),
});
