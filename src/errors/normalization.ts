import type { ParseErrorResponse } from "./parse";

// ErrorNormalization maps multiple internal/actual error codes
// to a single standardized error code shown to the end user.
//
// code  → the normalized (user-facing) error code
// items → list of original/internal error codes that should be mapped to `code`
export type ErrorNormalization = {
    code: string;
    items: string[];
};

export const normalizeError = (
    parsedResponse: ParseErrorResponse,
    customOverrides?: ErrorNormalization[]
) => {
    if (customOverrides) {
        for (const { items, code } of customOverrides) {
            if (items.includes(parsedResponse.code)) {
                return { code };
            }
        }
    }

    return parsedResponse;
};
