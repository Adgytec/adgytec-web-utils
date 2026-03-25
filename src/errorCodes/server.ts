import type { ErrorNormalization } from "../errors";
import { commonCodes } from "./common";

export const serverCodes = {
    malformedResponseBody: "malformed-response-body",
    malformedJsonFromServer: "malformed-json-from-server",
    invalidResponseShape: "invalid-response-shape",
    unknownServerError: "unknown-server-error",
    internalServerError: "internal-server-error",
} as const;

export const serverOverrides: ErrorNormalization = {
    code: commonCodes.unexpectedError,
    items: [
        serverCodes.malformedJsonFromServer,
        serverCodes.malformedResponseBody,
        serverCodes.invalidResponseShape,
    ],
} as const;
