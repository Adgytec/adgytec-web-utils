import z from "zod";
import { serverCodes } from "../errorCodes";
import { ApplicationError } from "../errors";

const serverErrorSchema = z
    .object({
        code: z.string(),
    })
    .loose();

export function parseErrorResponse(status: number, payload: unknown): never {
    const result = serverErrorSchema.safeParse(payload);
    if (result.success) {
        throw new ApplicationError(result.data.code, result.data);
    }

    if (status >= 500) {
        throw new ApplicationError(serverCodes.internalServerError);
    }

    throw new ApplicationError(serverCodes.unknownServerError, {
        payload,
    });
}
