import z from "zod";
import { authCodes } from "../errorCodes";

export const invalidApiKeySchema = z.object({
    code: z.literal(authCodes.invalidApiKey),
});

export const userNotFoundSchema = z.object({
    code: z.literal(authCodes.userNotFound),
});

export const jwtNotAcceptableSchema = z.object({
    code: z.literal(authCodes.jwtNotAcceptable),
});

export const invalidSignedUrlSchema = z.object({
    code: z.literal(authCodes.invalidSignedUrl),
});

export const hashMismatchSchema = z.object({
    code: z.literal(authCodes.hashMismatch),
});

export const invalidAuthHeaderValueSchema = z.object({
    code: z.literal(authCodes.invalidAuthHeaderValue),
});

export const unsupportedAuthSchemeSchema = z.object({
    code: z.literal(authCodes.unsupportedAuthScheme),
});

export const organizationStatusBadSchema = z.object({
    code: z.literal(authCodes.organizationStatusBad),
});

export const userNotExistsInOrganizationManagementSchema = z.object({
    code: z.literal(authCodes.userNotExistsInOrganizationManagement),
});

export const userNotExistInOrganizationSchema = z.object({
    code: z.literal(authCodes.userNotExistInOrganization),
});

export const userDisabledSchema = z.object({
    code: z.literal(authCodes.userDisabled),
});

export const tokenNotFoundSchema = z.object({
    code: z.literal(authCodes.tokenNotFound),
});
