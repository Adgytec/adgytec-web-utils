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

/**
 * Normalizes an error payload by mapping specific override codes into a generic `unexpected-error`.
 *
 * @param parsedResponse - Validated application error details.
 * @returns The normalized error details with override codes mapped to `unexpected-error`.
 */
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
