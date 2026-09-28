import type z from "zod";
import { httpReqHeaders } from "../constants";
import { miscCodes } from "../errorCodes";
import { ApplicationError } from "../errors";
import { parseErrorResponse } from "./errorResponse";
import { parseSuccessReponse } from "./successReponse";

/**
 * Decodes a native HTTP Response and validates the parsed JSON payload against a Zod schema.
 *
 * @param res - The fetch Response object.
 * @param schema - The Zod schema against which the success payload is validated.
 * @returns Promise resolving to the validated, typed payload.
 * @throws ApplicationError if response status is not ok, body is malformed, or schema validation fails.
 */
export function decodeAPIResponse<T>(
    res: Response,
    schema: z.ZodSchema<T>
): Promise<T>;

/**
 * Decodes a native HTTP Response when no response body payload is expected (e.g., 204 No Content).
 *
 * @param res - The fetch Response object.
 * @returns Promise resolving to null if the response status is ok.
 * @throws ApplicationError if response status is not ok or error occurs.
 */
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
        throw new ApplicationError(miscCodes.malformedResponseBody, {
            response: res,
        });
    }

    let payload: unknown;
    if (raw.length > 0) {
        const contentType = res.headers.get("content-type")?.toLowerCase();
        if (
            !contentType?.includes(
                httpReqHeaders.contentType.valueApplicationJSON
            )
        ) {
            throw new ApplicationError(miscCodes.invalidResponseShape, {
                response: res,
            });
        }

        try {
            payload = JSON.parse(raw);
        } catch {
            throw new ApplicationError(miscCodes.malformedJsonFromServer, {
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
