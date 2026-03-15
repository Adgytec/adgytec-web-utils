import z from "zod";
import { commonCodes } from "../errorCodes";

export const invalidIDSchema = z.object({
    code: z.literal(commonCodes.invalidId),
});
