import isNetworkError from "is-network-error";
import { commonCodes } from "../errorCodes";
import { type ErrorDetails } from "../errorSchema";
import { ApplicationError } from "./applicationError";
import z from "zod";

type ParseErrorResponse =
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
            code: "network-error",
            debugMessage: err.toString(),
        };
    }

    if (err instanceof ApplicationError) {
        const errVal = err.parse();
        if (errVal instanceof z.ZodError) {
            return {
                code: "zod-error",
                error: errVal,
            };
        }
        return errVal;
    }

    return {
        code: "unexpected-error",
        debugMessage: err instanceof Error ? err.toString() : String(err),
    };
}
