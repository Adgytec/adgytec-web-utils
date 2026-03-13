import z from "zod";
import {
    INVALID_API_KEY,
    USER_NOT_FOUND,
    JWT_NOT_ACCEPTABLE,
    INVALID_SIGNED_URL,
    HASH_MISMATCH,
    INVALID_AUTH_HEADER_VALUE,
    UNSUPPORTED_AUTH_SCHEME,
    ORGANIZATION_STATUS_BAD,
    USER_NOT_EXISTS_IN_ORGANIZATION_MANAGEMENT,
    USER_NOT_EXIST_IN_ORGANIZATION,
    USER_DISABLED,
    TOKEN_NOT_FOUND,
} from "../errorCodes";

export const invalidApiKeySchema = z.object({
    code: z.literal(INVALID_API_KEY),
});

export const userNotFoundSchema = z.object({
    code: z.literal(USER_NOT_FOUND),
});

export const jwtNotAcceptableSchema = z.object({
    code: z.literal(JWT_NOT_ACCEPTABLE),
});

export const invalidSignedUrlSchema = z.object({
    code: z.literal(INVALID_SIGNED_URL),
});

export const hashMismatchSchema = z.object({
    code: z.literal(HASH_MISMATCH),
});

export const invalidAuthHeaderValueSchema = z.object({
    code: z.literal(INVALID_AUTH_HEADER_VALUE),
});

export const unsupportedAuthSchemeSchema = z.object({
    code: z.literal(UNSUPPORTED_AUTH_SCHEME),
});

export const organizationStatusBadSchema = z.object({
    code: z.literal(ORGANIZATION_STATUS_BAD),
});

export const userNotExistsInOrganizationManagementSchema = z.object({
    code: z.literal(USER_NOT_EXISTS_IN_ORGANIZATION_MANAGEMENT),
});

export const userNotExistInOrganizationSchema = z.object({
    code: z.literal(USER_NOT_EXIST_IN_ORGANIZATION),
});

export const userDisabledSchema = z.object({
    code: z.literal(USER_DISABLED),
});

export const tokenNotFoundSchema = z.object({
    code: z.literal(TOKEN_NOT_FOUND),
});

export const defaultAuthSchemas = [
    invalidApiKeySchema,
    userNotFoundSchema,
    jwtNotAcceptableSchema,
    invalidSignedUrlSchema,
    hashMismatchSchema,
    invalidAuthHeaderValueSchema,
    unsupportedAuthSchemeSchema,
    organizationStatusBadSchema,
    userNotExistsInOrganizationManagementSchema,
    userNotExistInOrganizationSchema,
    userDisabledSchema,
    tokenNotFoundSchema,
];
