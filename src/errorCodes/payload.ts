export const payloadCodes = {
    invalidRequestBody: "invalid-request-body",
    unknownFieldInRequestBody: "unknown-field-in-request-body",
    emptyRequestBody: "empty-request-body",
    requestBodyTooLarge: "request-body-too-large",
} as const;

export const payloadOverrides = [
    payloadCodes.invalidRequestBody,
    payloadCodes.unknownFieldInRequestBody,
    payloadCodes.emptyRequestBody,
    payloadCodes.requestBodyTooLarge,
] as const;
