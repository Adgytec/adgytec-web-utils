import type { ErrorNormalization } from "../errors";
import { miscCodes } from "./misc";

export const reqParamsCodes = {
    invalidID: "invalid-id",
} as const;

export const reqParamsOverrides = {
    code: miscCodes.unexpectedError,
    items: [reqParamsCodes.invalidID],
} as const satisfies ErrorNormalization;
