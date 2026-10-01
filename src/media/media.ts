import { z } from "zod";
import { CredentialsSchema } from "../credentials";

/**
 * Schema validating destination parameters and credentials for a single media upload target.
 */
export const SingleUploadDetailsSchema = z.object({
    region: z.string(),
    credentials: CredentialsSchema.nullable(),
    bucket: z.string(),
    path: z.string(),
});

/**
 * Describes destination parameters and credentials for a single media upload target.
 */
export type SingleUploadDetails = z.infer<typeof SingleUploadDetailsSchema>;

/**
 * Schema validating an individual media item to be uploaded within an upload group.
 */
export const UploadObjectSchema = z.object({
    id: z.uuid(),
    bucket: z.string(),
    path: z.string(),
});

/**
 * Describes an individual media item to be uploaded within an upload group.
 */
export type UploadObject = z.infer<typeof UploadObjectSchema>;

/**
 * Schema validating a group of upload objects that share a common region and credentials.
 */
export const UploadGroupSchema = z.object({
    numObjects: z.int(),
    region: z.string(),
    credentials: CredentialsSchema.nullable(),
    objects: z.array(UploadObjectSchema),
});

/**
 * Describes a group of upload objects that share a common region and credentials.
 */
export type UploadGroup = z.infer<typeof UploadGroupSchema>;

/**
 * Schema validating batch upload details containing one or more upload groups.
 */
export const UploadDetailsSchema = z.object({
    groups: z.array(UploadGroupSchema),
});

/**
 * Describes batch upload details containing one or more upload groups.
 */
export type UploadDetails = z.infer<typeof UploadDetailsSchema>;
