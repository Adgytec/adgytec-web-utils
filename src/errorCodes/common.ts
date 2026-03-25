import type { ErrorNormalization } from "../errors";

export const commonCodes = {
    invalidId: "invalid-id",
    routeNotFound: "route-not-found",
    methodNotAllowed: "method-not-allowed",
    networkError: "network-error",
    unexpectedError: "unexpected-error",
    zodError: "zod-error",
} as const;

export const commonOverrides: ErrorNormalization = {
    code: commonCodes.unexpectedError,
    items: [
        commonCodes.invalidId,
        commonCodes.routeNotFound,
        commonCodes.methodNotAllowed,
        commonCodes.zodError,
    ],
};
