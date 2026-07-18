import { z } from "zod";

export const ImageSchema = z.object({
    thumbnail: z.string(),
    small: z.string(),
    medium: z.string(),
    large: z.string(),
    extraLarge: z.string(),
});

export type Image = z.infer<typeof ImageSchema>;

export const VideoSchema = z.object({
    thumbnail: z.string(),
    adaptiveManifest: z.string(),
    preview: z.string(),
});

export type Video = z.infer<typeof VideoSchema>;

export const MediaStatusSchema = z.enum([
    "pending",
    "complete-multipart-success",
    "complete-multipart-failed",
    "validating",
    "validation-failed",
    "validation-success",
    "processing",
    "processing-failed",
    "completed",
]);

export type MediaStatus = z.infer<typeof MediaStatusSchema>;

export const MediaSchema = z.object({
    originalMedia: z.string(),
    mimeType: z.string(),
    size: z.number(),
    status: MediaStatusSchema,
    imageVariants: ImageSchema.optional(),
    videoDetails: VideoSchema.optional(),
});

export type Media = z.infer<typeof MediaSchema>;
