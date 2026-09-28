import type { ErrorNormalization } from "../errors";
import { miscCodes } from "./misc";

export const mediaCodes = {
    mediaTooLarge: "media-too-large",
    duplicatedMediaID: "duplicate-media-id",
} as const;

export const mediaOverrides = {
    code: miscCodes.unexpectedError,
    items: [mediaCodes.duplicatedMediaID],
} as const satisfies ErrorNormalization;
