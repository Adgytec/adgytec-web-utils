import z from "zod";
import { authCodes } from "../errorCodes";

/**
 * Validates payload for `invalid-signed-url` error.
 */
export const invalidSignedUrlSchema = z.object({
    code: z.literal(authCodes.invalidSignedUrl),
});

/**
 * Validates payload for `invalid-jwt` error.
 */
export const invalidJWTSchema = z.object({
    code: z.literal(authCodes.invalidJWT),
});
