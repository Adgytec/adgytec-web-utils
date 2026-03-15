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
