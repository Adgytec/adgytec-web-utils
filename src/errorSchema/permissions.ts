import z from "zod";
import { permissionCodes } from "../errorCodes";

/**
 * Validates payload for `permission-denied` error, specifying the required permission key and code.
 */
export const permissionDeniedSchema = z.object({
    code: z.literal(permissionCodes.permissionDenied),
    permissionKey: z.string(),
    permissionCode: z.string(),
});

/**
 * Validates payload for `workspace-not-found` error.
 */
export const workspaceNotFoundSchema = z.object({
    code: z.literal(permissionCodes.workspaceNotFound),
});
