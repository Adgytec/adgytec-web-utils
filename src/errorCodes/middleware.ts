import type { ErrorNormalization } from "../errors";
import { miscCodes } from "./misc";

export const middlewareCodes = {
    workspaceForbidden: "workspace-forbidden",
    actorForbidden: "actor-forbidden",
    actorNotInWorkspace: "actor-not-in-workspace",
    unsupportedAuthScheme: "unsupported-auth-scheme",
    invalidAuthHeader: "invalid-auth-header",
    moduleNotInWorkspace: "module-not-in-workspace",
} as const;

export const middlewareOverrides = {
    code: miscCodes.unexpectedError,
    items: [
        middlewareCodes.unsupportedAuthScheme,
        middlewareCodes.invalidAuthHeader,
    ],
} as const satisfies ErrorNormalization;
