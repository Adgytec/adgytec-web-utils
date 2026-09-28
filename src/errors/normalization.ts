import { defaultOverrides, miscCodes } from "../errorCodes";
import type {
    ErrorCode,
    ErrorDetails,
    ErrorDetailsNormalized,
} from "../errorSchema";

const defaultOverridesSet: ReadonlySet<ErrorCode> = new Set(defaultOverrides);

const isDefaultOverrideCode = (code: ErrorCode): boolean => {
    return defaultOverridesSet.has(code);
};

// Normalizes an error object to ensure a consistent `code` for downstream usage.
export const normalizeError = (
    parsedResponse: ErrorDetails
): ErrorDetailsNormalized => {
    if (isDefaultOverrideCode(parsedResponse.code)) {
        return {
            code: miscCodes.unexpectedError,
            debugMessage: JSON.stringify(parsedResponse),
        };
    }

    return parsedResponse as ErrorDetailsNormalized;
};
