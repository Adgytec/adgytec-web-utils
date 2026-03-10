import type { z } from "zod";
import { ApplicationError } from "../errors";
import { INVALID_RESPONSE_SHAPE, MALFORMED_JSON_FROM_SERVER } from "./codes";

export async function parseSuccessReponse<T>(
    res: Response,
    schema?: z.ZodSchema<T>
): Promise<T | null> {
    if (!schema) return null;

    let payload: any;
    try {
        payload = await res.json();
    } catch (e) {
        throw new ApplicationError(MALFORMED_JSON_FROM_SERVER, payload);
    }

    const parsed = schema.safeParse(payload);
    if (parsed.success) return parsed.data;

    throw new ApplicationError(INVALID_RESPONSE_SHAPE, {
        message: parsed.error.message,
        payload: payload,
    });
}
