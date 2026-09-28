import z from "zod";
import { constraintsCodes } from "../errorCodes";

export const limitReachedSchema = z.object({
    code: z.literal(constraintsCodes.limitReached),
    constraintKey: z.string(),
    constraintCode: z.string(),
    limit: z.number(),
    currentValue: z.number(),
});
