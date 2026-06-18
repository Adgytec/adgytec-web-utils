import type { ErrorNormalization } from "../errors";
import { commonCodes } from "./common";

export const requestBodyCodes = {
    invalidRequestBody: "invalid-request-body",
    unknownFieldInRequestBody: "unknown-field-in-request-body",
    emptyRequestBody: "empty-request-body",
    requestBodyTooLarge: "request-body-too-large",
} as const;

export const reqBodyOverrides = {
    code: commonCodes.unexpectedError,
    items: [
        requestBodyCodes.invalidRequestBody,
        requestBodyCodes.unknownFieldInRequestBody,
        requestBodyCodes.emptyRequestBody,
        requestBodyCodes.requestBodyTooLarge,
    ],
} as const satisfies ErrorNormalization;
