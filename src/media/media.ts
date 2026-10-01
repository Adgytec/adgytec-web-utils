import { z } from "zod";
import { CredentialsSchema } from "../credentials";

export const SingleUploadDetailsSchema = z.object({
    region: z.string(),
    credentials: CredentialsSchema.nullable(),
    bucket: z.string(),
    path: z.string(),
});

export type SingleUploadDetails = z.infer<typeof SingleUploadDetailsSchema>;

export const UploadObjectSchema = z.object({
    id: z.uuid(),
    bucket: z.string(),
    path: z.string(),
});

export type UploadObject = z.infer<typeof UploadObjectSchema>;

export const UploadGroupSchema = z.object({
    numObjects: z.int(),
    region: z.string(),
    credentials: CredentialsSchema.nullable(),
    objects: z.array(UploadObjectSchema),
});

export type UploadGroup = z.infer<typeof UploadGroupSchema>;

export const UploadDetailsSchema = z.object({
    groups: z.array(UploadGroupSchema),
});

export type UploadDetails = z.infer<typeof UploadDetailsSchema>;
