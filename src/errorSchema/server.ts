import z from "zod";
import { serverCodes } from "../errorCodes";

export const malformedJSONFromServerSchema = z.object({
    code: z.literal(serverCodes.malformedJsonFromServer),
    response: z.instanceof(Response),
});

export const invalidResponseShapeSchema = z
    .object({
        code: z.literal(serverCodes.invalidResponseShape),
        message: z.string(),
        payload: z.unknown(),
    })
    .transform(({ code, message, payload }) => ({
        code,
        debugMessage: message,
        payload,
    }));

export const unknownServerErrorSchema = z.object({
    code: z.literal(serverCodes.unknownServerError),
    payload: z.unknown(),
});

export const internalServerErrorSchema = z.object({
    code: z.literal(serverCodes.internalServerError),
});
