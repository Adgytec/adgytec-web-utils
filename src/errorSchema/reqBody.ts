import z from "zod";
import { requestBodyCodes } from "../errorCodes";

export const invalidRequestBodySchema = z.object({
    code: z.literal(requestBodyCodes.invalidRequestBody),
    details: z
        .object({
            message: z.string(),
        })
        .transform(({ message }) => ({
            debugMessage: message,
        })),
});

export const unknownFieldInRequestBodySchema = z.object({
    code: z.literal(requestBodyCodes.unknownFieldInRequestBody),
    details: z
        .object({
            message: z.string(),
        })
        .transform(({ message }) => ({
            debugMessage: message,
        })),
});

export const requestBodyTooLargeSchema = z.object({
    code: z.literal(requestBodyCodes.requestBodyTooLarge),
    details: z.object({
        limit: z.int(),
    }),
});

export const emptyRequestBodySchema = z.object({
    code: z.literal(requestBodyCodes.emptyRequestBody),
    details: z
        .object({
            message: z.string(),
        })
        .transform(({ message }) => ({
            debugMessage: message,
        })),
});
