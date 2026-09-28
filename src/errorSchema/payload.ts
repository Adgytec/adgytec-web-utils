import z from "zod";
import { payloadCodes } from "../errorCodes";

export const invalidRequestBodySchema = z
    .object({
        code: z.literal(payloadCodes.invalidRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));

export const unknownFieldInRequestBodySchema = z
    .object({
        code: z.literal(payloadCodes.unknownFieldInRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));

export const requestBodyTooLargeSchema = z.object({
    code: z.literal(payloadCodes.requestBodyTooLarge),
    limit: z.int(),
});

export const emptyRequestBodySchema = z
    .object({
        code: z.literal(payloadCodes.emptyRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));
