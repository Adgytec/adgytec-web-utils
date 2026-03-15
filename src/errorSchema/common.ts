import z from "zod";
import { commonCodes } from "../errorCodes";

export const invalidIDSchema = z.object({
    code: z.literal(commonCodes.invalidId),
});

export const routeNotFoundSchema = z.object({
    code: z.literal(commonCodes.routeNotFound),
});

export const methodNotAllowedSchema = z.object({
    code: z.literal(commonCodes.methodNotAllowed),
});
