import type { ErrorNormalization } from "../errors";

export const authCodes = {
    authError: "auth-error",
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
    invalidJWT: "invalid-jwt",
    invalidSession: "invalid-session",
    tokenExpired: "token-expired",
} as const;

export const authOverrides = {
    code: authCodes.authError,
    items: [
        authCodes.invalidApiKey,
        authCodes.jwtNotAcceptable,
        authCodes.invalidAuthHeaderValue,
        authCodes.unsupportedAuthScheme,
        authCodes.tokenNotFound,
        authCodes.invalidJWT,
        authCodes.invalidSession,
        authCodes.tokenExpired,
    ],
} as const satisfies ErrorNormalization;

export const signedURLOverrides = {
    code: authCodes.invalidSignedUrl,
    items: [authCodes.hashMismatch],
} as const satisfies ErrorNormalization;
