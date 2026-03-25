import { defaultOverrides } from "../errorCodes";
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

// Normalizes an error object to ensure a consistent `code` for downstream usage (e.g. translations/UI).
//
// - Accepts both strongly-typed and flexible error objects (must contain `code`)
// - Applies custom and default overrides to map multiple error codes to a single normalized code
// - May intentionally strip additional fields when an override is applied
// - Otherwise returns the original error object as-is
//
// Note: This function is intended for presentation layers, not for logic that depends on strict typing.
export const normalizeError = (
    parsedResponse:
        | ParseErrorResponse
        | {
              code: string;
              [key: string]: unknown;
          },
    customOverrides?: ErrorNormalization[]
) => {
    if (customOverrides) {
        for (const { items, code } of customOverrides) {
            if (items.includes(parsedResponse.code)) {
                return { code };
            }
        }
    }

    for (const { items, code } of defaultOverrides) {
        if (items.includes(parsedResponse.code)) {
            return { code };
        }
    }

    return parsedResponse;
};
