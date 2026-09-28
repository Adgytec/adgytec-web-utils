import z from "zod";
import { authCodes } from "../errorCodes";

export const invalidSignedUrlSchema = z.object({
    code: z.literal(authCodes.invalidSignedUrl),
});

export const invalidJWTSchema = z.object({
    code: z.literal(authCodes.invalidJWT),
});
