import z from "zod";
import { middlewareCodes } from "../errorCodes";

export const workspaceForbiddenSchema = z.object({
    code: z.literal(middlewareCodes.workspaceForbidden),
    workspaceID: z.string(),
});

export const actorForbiddenSchema = z.object({
    code: z.literal(middlewareCodes.actorForbidden),
    currentActor: z.string(),
    requiredActor: z.string(),
});

export const actorNotInWorkspace = z.object({
    code: z.literal(middlewareCodes.actorNotInWorkspace),
    workspaceID: z.string(),
});

export const unsupportedAuthSchemeSchema = z.object({
    code: z.literal(middlewareCodes.unsupportedAuthScheme),
    currentScheme: z.string(),
    supportedSchemes: z.array(z.string()).nullish(),
});

export const invalidAuthHeaderSchema = z.object({
    code: z.literal(middlewareCodes.invalidAuthHeader),
});

export const moduleNotInWorkspaceSchema = z.object({
    code: z.literal(middlewareCodes.moduleNotInWorkspace),
    workspaceID: z.string(),
    module: z.string(),
});
