import z from "zod";
import { miscCodes } from "../errorCodes";
import { ApplicationError } from "../errors";

const serverErrorSchema = z
    .object({
        code: z.string(),
    })
    .loose();

/**
 * Parses an HTTP error response status and payload into an appropriate `ApplicationError`.
 *
 * @param status - The HTTP response status code.
 * @param payload - The decoded JSON payload or raw response content.
 * @throws ApplicationError always.
 */
export function parseErrorResponse(status: number, payload: unknown): never {
    const result = serverErrorSchema.safeParse(payload);
    if (result.success) {
        throw new ApplicationError(result.data.code, result.data);
    }

    if (status >= 500) {
        throw new ApplicationError(miscCodes.internalServerError);
    }

    throw new ApplicationError(miscCodes.unknownServerError, {
        payload,
    });
}
