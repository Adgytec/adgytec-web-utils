import type { ErrorNormalization } from "../errors";

export const authCodes = {
    invalidApiKey: "invalid-api-key",
    userNotFound: "user-not-found",
    jwtNotAcceptable: "jwt-not-acceptable",
    invalidSignedUrl: "invalid-signed-url",
    hashMismatch: "hash-mismatch",
    invalidAuthHeaderValue: "invalid-auth-header-value",
    unsupportedAuthScheme: "unsupported-auth-scheme",
    organizationStatusBad: "bad-org-status",
    userNotExistsInOrganizationManagement:
        "user-not-exists-in-organization-management",
    userNotExistInOrganization: "user-not-exists-in-organization",
    userDisabled: "user-disabled",
    tokenNotFound: "token-not-found",
} as const;

export const authOverrides: ErrorNormalization = {
    code: "auth-error",
    items: [
        authCodes.invalidApiKey,
        authCodes.jwtNotAcceptable,
        authCodes.invalidAuthHeaderValue,
        authCodes.unsupportedAuthScheme,
        authCodes.tokenNotFound,
    ],
} as const;

export const signedURLOverrides: ErrorNormalization = {
    code: authCodes.invalidSignedUrl,
    items: [authCodes.hashMismatch],
} as const;
