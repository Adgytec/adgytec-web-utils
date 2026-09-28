/**
 * Error codes related to HTTP request body structure, sizing, and content validation.
 */
export const payloadCodes = {
    invalidRequestBody: "invalid-request-body",
    unknownFieldInRequestBody: "unknown-field-in-request-body",
    emptyRequestBody: "empty-request-body",
    requestBodyTooLarge: "request-body-too-large",
} as const;

/**
 * Payload error codes subject to default normalization into `unexpected-error`.
 */
export const payloadOverrides = [
    payloadCodes.invalidRequestBody,
    payloadCodes.unknownFieldInRequestBody,
    payloadCodes.emptyRequestBody,
    payloadCodes.requestBodyTooLarge,
] as const;
