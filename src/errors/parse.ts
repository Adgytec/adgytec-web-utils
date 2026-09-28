import isNetworkError from "is-network-error";
import z from "zod";
import { miscCodes } from "../errorCodes";
import type { ErrorDetails } from "../errorSchema";
import { ApplicationError } from "./applicationError";

/**
 * Parses an arbitrary runtime error into a structured, schema-compliant `ErrorDetails` payload.
 *
 * - Network errors are mapped to `network-error`.
 * - `ApplicationError` instances are parsed via their schema; if invalid, they are mapped to `zod-error`.
 * - All other errors are mapped to `unexpected-error`.
 *
 * @param err - The caught exception or unknown error value.
 * @returns Structured `ErrorDetails` object conforming to `errorSchema`.
 */
export function parseError(err: unknown): ErrorDetails {
    if (isNetworkError(err)) {
        return {
            code: miscCodes.networkError,
            debugMessage: err.toString(),
        };
    }

    if (err instanceof ApplicationError) {
        const errVal = err.parse();
        if (errVal instanceof z.ZodError) {
            return {
                code: miscCodes.zodError,
                error: errVal,
            };
        }
        return errVal;
    }

    return {
        code: miscCodes.unexpectedError,
        debugMessage: err instanceof Error ? err.toString() : String(err),
    };
}
