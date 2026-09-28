/**
 * Error codes produced by request-processing middleware (authentication, workspace access, actor verification).
 */
export const middlewareCodes = {
    workspaceForbidden: "workspace-forbidden",
    actorForbidden: "actor-forbidden",
    actorNotInWorkspace: "actor-not-in-workspace",
    unsupportedAuthScheme: "unsupported-auth-scheme",
    invalidAuthHeader: "invalid-auth-header",
    moduleNotInWorkspace: "module-not-in-workspace",
} as const;

/**
 * Middleware error codes subject to default normalization into `unexpected-error`.
 */
export const middlewareOverrides = [
    middlewareCodes.unsupportedAuthScheme,
    middlewareCodes.invalidAuthHeader,
] as const;
