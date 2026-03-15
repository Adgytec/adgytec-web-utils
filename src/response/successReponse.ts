import type { z } from "zod";
import { ApplicationError } from "../errors";
import { serverCodes } from "../errorCodes";

export function parseSuccessReponse<T>(
    payload: unknown,
    schema?: z.ZodSchema<T>
): T | null {
    if (!schema) return null;

    const parsed = schema.safeParse(payload);
    if (parsed.success) return parsed.data;

    throw new ApplicationError(serverCodes.invalidResponseShape, {
        message: parsed.error.message,
        payload: payload,
    });
}
