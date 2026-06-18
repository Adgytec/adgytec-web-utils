import type { ErrorNormalization } from "../errors";
import { commonCodes } from "./common";

export const paginationCodes = {
    invalidCursorValue: "invalid-cursor-value",
} as const;

export const paginationOverrides = {
    code: commonCodes.unexpectedError,
    items: [paginationCodes.invalidCursorValue],
} as const satisfies ErrorNormalization;
