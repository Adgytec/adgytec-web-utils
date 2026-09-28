import isNetworkError from "is-network-error";
import z from "zod";
import { miscCodes } from "../errorCodes";
import type { ErrorDetails } from "../errorSchema";
import { ApplicationError } from "./applicationError";

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
