import isNetworkError from "is-network-error";
import z from "zod";
import { commonCodes } from "../errorCodes";
import type { ErrorDetails } from "../errorSchema";
import { ApplicationError } from "./applicationError";

export type ParseErrorResponse =
    | {
          code: typeof commonCodes.networkError;
          debugMessage: string;
      }
    | {
          code: typeof commonCodes.unexpectedError;
          debugMessage: string;
      }
    | {
          code: typeof commonCodes.zodError;
          error: z.ZodError;
      }
    | ErrorDetails;

export function parseError(err: unknown): ParseErrorResponse {
    if (isNetworkError(err)) {
        return {
            code: commonCodes.networkError,
            debugMessage: err.toString(),
        };
    }

    if (err instanceof ApplicationError) {
        const errVal = err.parse();
        if (errVal instanceof z.ZodError) {
            return {
                code: commonCodes.zodError,
                error: errVal,
            };
        }
        return errVal;
    }

    return {
        code: commonCodes.unexpectedError,
        debugMessage: err instanceof Error ? err.toString() : String(err),
    };
}
