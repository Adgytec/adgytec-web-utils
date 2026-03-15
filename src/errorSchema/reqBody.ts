import z from "zod";
import { requestBodyCodes } from "../errorCodes";

export const invalidRequestBodySchema = z
    .object({
        code: z.literal(requestBodyCodes.invalidRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));

export const unknownFieldInRequestBodySchema = z
    .object({
        code: z.literal(requestBodyCodes.unknownFieldInRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));

export const requestBodyTooLargeSchema = z.object({
    code: z.literal(requestBodyCodes.requestBodyTooLarge),
    limit: z.int(),
});

export const emptyRequestBodySchema = z
    .object({
        code: z.literal(requestBodyCodes.emptyRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));
