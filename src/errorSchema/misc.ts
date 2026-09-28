import z from "zod";
import { miscCodes } from "../errorCodes";

export const routeNotFoundSchema = z.object({
    code: z.literal(miscCodes.routeNotFound),
});

export const methodNotAllowedSchema = z.object({
    code: z.literal(miscCodes.methodNotAllowed),
});

export const networkErrorSchema = z.object({
    code: z.literal(miscCodes.networkError),
    debugMessage: z.string(),
});

export const unexpectedErrorSchema = z.object({
    code: z.literal(miscCodes.unexpectedError),
    debugMessage: z.string(),
});

export const zodErrorSchema = z.object({
    code: z.literal(miscCodes.zodError),
    error: z.instanceof(z.ZodError),
});

export const malformedResponseBodySchema = z.object({
    code: z.literal(miscCodes.malformedResponseBody),
    response: z.instanceof(Response),
});

export const malformedJSONFromServerSchema = z.object({
    code: z.literal(miscCodes.malformedJsonFromServer),
    response: z.instanceof(Response),
});

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

export const unknownServerErrorSchema = z.object({
    code: z.literal(miscCodes.unknownServerError),
    payload: z.unknown(),
});

export const internalServerErrorSchema = z.object({
    code: z.literal(miscCodes.internalServerError),
});
