import z from "zod";
import { payloadCodes } from "../errorCodes";

/**
 * Validates and transforms payload for `invalid-request-body` error.
 */
export const invalidRequestBodySchema = z
    .object({
        code: z.literal(payloadCodes.invalidRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));

/**
 * Validates and transforms payload for `unknown-field-in-request-body` error.
 */
export const unknownFieldInRequestBodySchema = z
    .object({
        code: z.literal(payloadCodes.unknownFieldInRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));

/**
 * Validates payload for `request-body-too-large` error, specifying the byte limit.
 */
export const requestBodyTooLargeSchema = z.object({
    code: z.literal(payloadCodes.requestBodyTooLarge),
    limit: z.int(),
});

/**
 * Validates and transforms payload for `empty-request-body` error.
 */
export const emptyRequestBodySchema = z
    .object({
        code: z.literal(payloadCodes.emptyRequestBody),
        message: z.string(),
    })
    .transform(({ code, message }) => ({
        code,
        debugMessage: message,
    }));
