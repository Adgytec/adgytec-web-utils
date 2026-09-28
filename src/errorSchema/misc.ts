import z from "zod";
import { miscCodes } from "../errorCodes";

/**
 * Validates payload for `route-not-found` error.
 */
export const routeNotFoundSchema = z.object({
    code: z.literal(miscCodes.routeNotFound),
});

/**
 * Validates payload for `method-not-allowed` error.
 */
export const methodNotAllowedSchema = z.object({
    code: z.literal(miscCodes.methodNotAllowed),
});

/**
 * Validates payload for `network-error` client connectivity errors.
 */
export const networkErrorSchema = z.object({
    code: z.literal(miscCodes.networkError),
    debugMessage: z.string(),
});

/**
 * Validates payload for `unexpected-error` unhandled runtime failures or normalized override errors.
 */
export const unexpectedErrorSchema = z.object({
    code: z.literal(miscCodes.unexpectedError),
    debugMessage: z.string(),
});

/**
 * Validates payload for `zod-error` schema validation failures.
 */
export const zodErrorSchema = z.object({
    code: z.literal(miscCodes.zodError),
    error: z.instanceof(z.ZodError),
});

/**
 * Validates payload for `malformed-response-body` when HTTP response body cannot be read.
 */
export const malformedResponseBodySchema = z.object({
    code: z.literal(miscCodes.malformedResponseBody),
    response: z.instanceof(Response),
});

/**
 * Validates payload for `malformed-json-from-server` when response body fails JSON parsing.
 */
export const malformedJSONFromServerSchema = z.object({
    code: z.literal(miscCodes.malformedJsonFromServer),
    response: z.instanceof(Response),
});

/**
 * Validates and transforms payload for `invalid-response-shape` when response fails schema verification.
 */
export const invalidResponseShapeSchema = z
    .object({
        code: z.literal(miscCodes.invalidResponseShape),
        message: z.string(),
        payload: z.unknown(),
    })
    .transform(({ code, message, payload }) => ({
        code,
        debugMessage: message,
        payload,
    }));

/**
 * Validates payload for `unknown-server-error` when server responds with an error status lacking a known code.
 */
export const unknownServerErrorSchema = z.object({
    code: z.literal(miscCodes.unknownServerError),
    payload: z.unknown(),
});

/**
 * Validates payload for `internal-server-error` 500 status responses without detailed payloads.
 */
export const internalServerErrorSchema = z.object({
    code: z.literal(miscCodes.internalServerError),
});
