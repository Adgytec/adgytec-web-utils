import z from "zod";
import { constraintsCodes } from "../errorCodes";

/**
 * Validates payload for `limit-reached` error, detailing the constraint key, limit, and current usage.
 */
export const limitReachedSchema = z.object({
    code: z.literal(constraintsCodes.limitReached),
    constraintKey: z.string(),
    constraintCode: z.string(),
    limit: z.number(),
    currentValue: z.number(),
});
