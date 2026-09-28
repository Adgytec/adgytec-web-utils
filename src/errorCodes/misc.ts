export const miscCodes = {
    malformedResponseBody: "malformed-response-body",
    malformedJsonFromServer: "malformed-json-from-server",
    invalidResponseShape: "invalid-response-shape",
    unknownServerError: "unknown-server-error",
    internalServerError: "internal-server-error",
    routeNotFound: "route-not-found",
    methodNotAllowed: "method-not-allowed",
    networkError: "network-error",
    unexpectedError: "unexpected-error",
    zodError: "zod-error",
} as const;

export const miscOverrides = [
    miscCodes.malformedJsonFromServer,
    miscCodes.malformedResponseBody,
    miscCodes.invalidResponseShape,
    miscCodes.routeNotFound,
    miscCodes.methodNotAllowed,
    miscCodes.zodError,
] as const;
