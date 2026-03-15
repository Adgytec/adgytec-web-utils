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
    let payload: unknown;
    try {
        payload = await res.json();
    } catch (e) {
        throw new ApplicationError(serverCodes.malformedJsonFromServer, {
            response: res,
        });
    }

    if (res.ok) {
        return parseSuccessReponse(payload, schema);
    }

    return parseErrorResponse(payload);
}
