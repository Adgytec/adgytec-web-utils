import type { ErrorNormalization } from "../errors";
import { miscCodes } from "./misc";

export const payloadCodes = {
    invalidRequestBody: "invalid-request-body",
    unknownFieldInRequestBody: "unknown-field-in-request-body",
    emptyRequestBody: "empty-request-body",
    requestBodyTooLarge: "request-body-too-large",
} as const;

export const payloadOverrides = {
    code: miscCodes.unexpectedError,
    items: [
        payloadCodes.invalidRequestBody,
        payloadCodes.unknownFieldInRequestBody,
        payloadCodes.emptyRequestBody,
        payloadCodes.requestBodyTooLarge,
    ],
} as const satisfies ErrorNormalization;
