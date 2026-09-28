import z from "zod";
import { middlewareCodes } from "../errorCodes";

/**
 * Validates payload for `workspace-forbidden` error.
 */
export const workspaceForbiddenSchema = z.object({
    code: z.literal(middlewareCodes.workspaceForbidden),
    workspaceID: z.string(),
});

/**
 * Validates payload for `actor-forbidden` error when actor role does not match requirements.
 */
export const actorForbiddenSchema = z.object({
    code: z.literal(middlewareCodes.actorForbidden),
    currentActor: z.string(),
    requiredActor: z.string(),
});

/**
 * Validates payload for `actor-not-in-workspace` error when actor is not a member of the workspace.
 */
export const actorNotInWorkspaceSchema = z.object({
    code: z.literal(middlewareCodes.actorNotInWorkspace),
    workspaceID: z.string(),
});

/**
 * Validates payload for `unsupported-auth-scheme` error when authorization scheme is unrecognized.
 */
export const unsupportedAuthSchemeSchema = z.object({
    code: z.literal(middlewareCodes.unsupportedAuthScheme),
    currentScheme: z.string(),
    supportedSchemes: z.array(z.string()).nullish(),
});

/**
 * Validates payload for `invalid-auth-header` error when authorization header is malformed.
 */
export const invalidAuthHeaderSchema = z.object({
    code: z.literal(middlewareCodes.invalidAuthHeader),
});

/**
 * Validates payload for `module-not-in-workspace` error when an enabled module is missing from the workspace.
 */
export const moduleNotInWorkspaceSchema = z.object({
    code: z.literal(middlewareCodes.moduleNotInWorkspace),
    workspaceID: z.string(),
    module: z.string(),
});
