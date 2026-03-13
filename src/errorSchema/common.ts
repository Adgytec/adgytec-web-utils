import z from "zod";
import { INVALID_ID } from "../errorCodes";

export const invalidIDSchema = z.object({
    code: z.literal(INVALID_ID),
});

export const defaultCommonSchemas = [invalidIDSchema];
