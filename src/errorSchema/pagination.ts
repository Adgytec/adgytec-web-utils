import z from "zod";
import { paginationCodes } from "../errorCodes";

export const invalidCursorValueSchema = z.object({
    code: z.literal(paginationCodes.invalidCursorValue),
});
