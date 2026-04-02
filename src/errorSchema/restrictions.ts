import z from "zod";
import { restrictionCodes } from "../errorCodes";

export const limitExceededSchema = z.object({
    code: z.literal(restrictionCodes.limitExceededCode),
    action: z.string(),
    limit: z.int64(),
    currentValue: z.int64(),
});
