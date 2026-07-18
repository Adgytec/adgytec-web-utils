import { z } from "zod";

export const ImageSchema = z.object({
    thumbnail: z.url(),
    small: z.url(),
    medium: z.url(),
    large: z.url(),
    extraLarge: z.url(),
});

export type Image = z.infer<typeof ImageSchema>;

export const VideoSchema = z.object({
    thumbnail: z.url(),
    adaptiveManifest: z.url(),
    preview: z.url(),
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
