import type z from "zod";
import { serverCodes } from "../errorCodes";
import { ApplicationError } from "../errors";
import { parseErrorResponse } from "./errorResponse";
import { parseSuccessReponse } from "./successReponse";

// overloaded functions
export function decodeAPIResponse<T>(
    res: Response,
    schema: z.ZodSchema<T>
): Promise<T>;

export function decodeAPIResponse(res: Response): Promise<null>;

export async function decodeAPIResponse<T>(
    res: Response,
    schema?: z.ZodSchema<T>
): Promise<T | null> {
    // no need to handle response body
    // caller expects no response
    if (!schema && res.ok) {
        return null;
    }

    let raw: string;
    try {
        raw = await res.text();
    } catch {
        throw new ApplicationError(serverCodes.malformedResponseBody, {
            response: res,
        });
    }

    let payload: unknown;
    if (raw.length > 0) {
        try {
            payload = JSON.parse(raw);
        } catch {
            throw new ApplicationError(serverCodes.malformedJsonFromServer, {
                response: res,
            });
        }
    }

    if (res.ok) {
        if (schema) return parseSuccessReponse(payload, schema);
        return null;
    }

    return parseErrorResponse(res.status, payload);
}
