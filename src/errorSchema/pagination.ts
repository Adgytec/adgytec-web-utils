import z from "zod";
import { INVALID_CURSOR_VALUE } from "../errorCodes";

export const invalidCursorValueSchema = z.object({
    code: z.literal(INVALID_CURSOR_VALUE),
});

export const defaultPaginationSchemas = [invalidCursorValueSchema] as const;
