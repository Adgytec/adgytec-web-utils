import z from "zod";
import { ApplicationError } from "../errors";
import { serverCodes } from "../errorCodes";

const serverErrorSchema = z
    .object({
        code: z.string(),
    })
    .loose();

export function parseErrorResponse(payload: unknown): never {
    const result = serverErrorSchema.safeParse(payload);
    if (result.success) {
        throw new ApplicationError(result.data.code, result.data);
    }

    throw new ApplicationError(serverCodes.unknownServerError, {
        payload,
    });
}
