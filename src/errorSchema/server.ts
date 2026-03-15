import z from "zod";
import { serverCodes } from "../errorCodes";

export const malformedJSONFromServerSchema = z.object({
    code: z.literal(serverCodes.malformedJsonFromServer),
    details: z.object({
        response: z.instanceof(Response),
    }),
});

export const invalidResponseShapeSchema = z.object({
    code: z.literal(serverCodes.invalidResponseShape),
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
    code: z.literal(serverCodes.unknownServerError),
    details: z.object({
        payload: z.unknown(),
    }),
});
