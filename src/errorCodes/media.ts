export const mediaCodes = {
    mediaTooLarge: "media-too-large",
    duplicatedMediaID: "duplicate-media-id",
} as const;

export const mediaOverrides = [mediaCodes.duplicatedMediaID] as const;
