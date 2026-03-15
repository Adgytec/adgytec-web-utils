import z from "zod";
import {
    INVALID_RESPONSE_SHAPE,
    MALFORMED_JSON_FROM_SERVER,
    UNKNOWN_SERVER_ERROR,
} from "../errorCodes";

export const malformedJSONFromServerSchema = z.object({
    code: z.literal(MALFORMED_JSON_FROM_SERVER),
    details: z.object({
        response: z.instanceof(Response),
    }),
});

export const invalidResponseShapeSchema = z.object({
    code: z.literal(INVALID_RESPONSE_SHAPE),
    details: z
        .object({
            message: z.string(),
            payload: z.unknown(),
        })
        .transform(({ message, payload }) => ({
            debugMessage: message,
            payload,
        })),
});

export const unknownServerErrorSchema = z.object({
    code: z.literal(UNKNOWN_SERVER_ERROR),
    details: z.object({
        payload: z.unknown(),
    }),
});
