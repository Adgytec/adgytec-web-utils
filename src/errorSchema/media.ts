import z from "zod";
import { mediaCodes } from "../errorCodes";

export const mediaTooLargeSchema = z.object({
    code: z.literal(mediaCodes.mediaTooLarge),
    mediaID: z.string(),
    size: z.int(),
    maxSupportedSize: z.int(),
});

export const duplicateMediaIDSchema = z.object({
    code: z.literal(mediaCodes.duplicatedMediaID),
    mediaID: z.string(),
});
