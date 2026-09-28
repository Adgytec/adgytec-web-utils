import type z from "zod";
import { miscCodes } from "../errorCodes";
import { ApplicationError } from "../errors";

/**
 * Validates a successful API response payload against a Zod schema.
 *
 * @param payload - The decoded response body payload.
 * @param schema - The Zod schema against which payload is validated.
 * @returns The successfully parsed and typed data.
 * @throws ApplicationError with `invalid-response-shape` if payload is empty or invalid.
 */
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
