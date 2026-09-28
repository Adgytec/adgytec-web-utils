import type z from "zod";
import { miscCodes } from "../errorCodes";
import { ApplicationError } from "../errors";

export function parseSuccessReponse<T>(
    payload: unknown,
    schema: z.ZodSchema<T>
): T {
    if (!payload) {
        throw new ApplicationError(miscCodes.invalidResponseShape, {
            message: "Expected response body but received empty response",
            payload: payload,
        });
    }

    const parsed = schema.safeParse(payload);
    if (parsed.success) return parsed.data;

    throw new ApplicationError(miscCodes.invalidResponseShape, {
        message: parsed.error.message,
        payload: payload,
    });
}
