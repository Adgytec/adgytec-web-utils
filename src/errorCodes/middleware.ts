export const middlewareCodes = {
    workspaceForbidden: "workspace-forbidden",
    actorForbidden: "actor-forbidden",
    actorNotInWorkspace: "actor-not-in-workspace",
    unsupportedAuthScheme: "unsupported-auth-scheme",
    invalidAuthHeader: "invalid-auth-header",
    moduleNotInWorkspace: "module-not-in-workspace",
} as const;

export const middlewareOverrides = [
    middlewareCodes.unsupportedAuthScheme,
    middlewareCodes.invalidAuthHeader,
] as const;
