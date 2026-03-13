import z from "zod";
import {
    INVALID_RESPONSE_SHAPE,
    MALFORMED_JSON_FROM_SERVER,
    UNKNOWN_SERVER_ERROR,
} from "../errorCodes";

export const malformedJSONFromServerSchema = z
    .object({
        code: z.literal(MALFORMED_JSON_FROM_SERVER),
        details: z.instanceof(Response),
    })
    .transform(({ code, details }) => ({
        code,
        response: details,
    }));

export const invalidResponseShapeSchema = z
    .object({
        code: z.literal(INVALID_RESPONSE_SHAPE),
        details: z.object({
            message: z.string(),
            payload: z.unknown(),
        }),
    })
    .transform(({ code, details }) => ({
        code,
        debugMessage: details.message,
        payload: details.payload,
    }));

export const unknownServerErrorSchema = z
    .object({
        code: z.literal(UNKNOWN_SERVER_ERROR),
        details: z.unknown(),
    })
    .transform(({ code, details }) => ({
        code,
        payload: details,
    }));
