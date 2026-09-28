import z from "zod";
import { reqParamsCodes } from "../errorCodes";

/**
 * Validates payload for `invalid-id` error, identifying the parameter key that failed format validation.
 */
export const invalidIDSchema = z.object({
    code: z.literal(reqParamsCodes.invalidID),
    key: z.string(),
});
