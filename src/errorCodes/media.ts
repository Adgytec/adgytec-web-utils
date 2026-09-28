/**
 * Error codes related to media uploads and asset management.
 */
export const mediaCodes = {
    mediaTooLarge: "media-too-large",
    duplicatedMediaID: "duplicate-media-id",
} as const;

/**
 * Media error codes subject to default normalization into `unexpected-error`.
 */
export const mediaOverrides = [mediaCodes.duplicatedMediaID] as const;
