import z from "zod";
import { mediaCodes } from "../errorCodes";

/**
 * Validates payload for `media-too-large` error, indicating file size exceeded maximum limits.
 */
export const mediaTooLargeSchema = z.object({
    code: z.literal(mediaCodes.mediaTooLarge),
    mediaID: z.string(),
    size: z.int(),
    maxSupportedSize: z.int(),
});

/**
 * Validates payload for `duplicate-media-id` error, indicating the specified media ID already exists.
 */
export const duplicateMediaIDSchema = z.object({
    code: z.literal(mediaCodes.duplicatedMediaID),
    mediaID: z.string(),
});
