import { z } from "zod";
import { ApplicationError } from "../errors";
import { serverCodes } from "../errorCodes";
import { parseSuccessReponse } from "./successReponse";
import { parseErrorResponse } from "./errorResponse";

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
    } catch (e) {
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
        // schema will always be present
        return parseSuccessReponse(payload, schema!);
    }

    return parseErrorResponse(res.status, payload);
}
