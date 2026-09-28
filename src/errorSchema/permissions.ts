import z from "zod";
import { permissionCodes } from "../errorCodes";

export const permissionDeniedSchema = z.object({
    code: z.literal(permissionCodes.permissionDenied),
    permissionKey: z.string(),
    permissionCode: z.string(),
});

export const workspaceNotFoundSchema = z.object({
    code: z.literal(permissionCodes.workspaceNotFound),
});
