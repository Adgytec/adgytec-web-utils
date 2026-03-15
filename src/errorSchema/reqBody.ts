import z from "zod";
import {
    EMPTY_REQUEST_BODY,
    INVALID_REQUEST_BODY,
    REQUEST_BODY_TOO_LARGE,
    UNKNOWN_FIELD_IN_REQUEST_BODY,
} from "../errorCodes";

export const invalidRequestBodySchema = z.object({
    code: z.literal(INVALID_REQUEST_BODY),
    details: z
        .object({
            message: z.string(),
        })
        .transform(({ message }) => ({
            debugMessage: message,
        })),
});

export const unknownFieldInRequestBodySchema = z.object({
    code: z.literal(UNKNOWN_FIELD_IN_REQUEST_BODY),
    details: z
        .object({
            message: z.string(),
        })
        .transform(({ message }) => ({
            debugMessage: message,
        })),
});

export const requestBodyTooLargeSchema = z.object({
    code: z.literal(REQUEST_BODY_TOO_LARGE),
    details: z.object({
        limit: z.int(),
    }),
});

export const emptyRequestBodySchema = z.object({
    code: z.literal(EMPTY_REQUEST_BODY),
    details: z
        .object({
            message: z.string(),
        })
        .transform(({ message }) => ({
            debugMessage: message,
        })),
});
