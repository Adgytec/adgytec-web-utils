import { type DefaultOverrideCode, defaultOverrides } from "../errorCodes";
import type {
    ErrorCode,
    ErrorDetails,
    ErrorDetailsNormalized,
    NormalizedErrorCode,
} from "../errorSchema";

export type ErrorNormalization = {
    code: ErrorCode;
    items: readonly ErrorCode[];
};

const buildOverrideMap = (
    overrides: readonly ErrorNormalization[]
): ReadonlyMap<DefaultOverrideCode, NormalizedErrorCode> => {
    const map = new Map<DefaultOverrideCode, NormalizedErrorCode>();

    for (const { code, items } of overrides) {
        for (const item of items) {
            if (!map.has(item as DefaultOverrideCode)) {
                map.set(
                    item as DefaultOverrideCode,
                    code as NormalizedErrorCode
                );
            }
        }
    }

    return map;
};
const defaultOverridesMap = buildOverrideMap(defaultOverrides);

const isNormalizedCode = (code: ErrorCode): code is DefaultOverrideCode => {
    return defaultOverridesMap.has(code as DefaultOverrideCode);
};

// Normalizes an error object to ensure a consistent `code` for downstream usage.
export const normalizeError = (
    parsedResponse: ErrorDetails
): ErrorDetailsNormalized => {
    if (isNormalizedCode(parsedResponse.code)) {
        const normalizedCode = defaultOverridesMap.get(parsedResponse.code);
        return {
            code: normalizedCode,
        } as ErrorDetailsNormalized;
    }

    return parsedResponse as ErrorDetailsNormalized;
};
