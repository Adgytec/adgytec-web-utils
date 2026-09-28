import assert from "node:assert/strict";
import { test } from "node:test";
import * as z from "zod";
import {
    mediaCodes,
    middlewareCodes,
    miscCodes,
    reqParamsCodes,
} from "../src/errorCodes";
import type { ErrorDetails } from "../src/errorSchema";
import { ApplicationError, normalizeError, parseError } from "../src/errors";

test("ApplicationError stores details and parses known error schemas", () => {
    const error = new ApplicationError(mediaCodes.mediaTooLarge, {
        mediaID: "large-file.mov",
        size: 20,
        maxSupportedSize: 10,
    });

    assert.equal(error.code, mediaCodes.mediaTooLarge);
    assert.deepEqual(error.details, {
        code: mediaCodes.mediaTooLarge,
        mediaID: "large-file.mov",
        size: 20,
        maxSupportedSize: 10,
    });
    assert.deepEqual(error.parse(), error.details);
});

test("ApplicationError returns a ZodError when details do not match the schema", () => {
    const error = new ApplicationError(mediaCodes.mediaTooLarge, {
        mediaID: "large-file.mov",
    });

    assert.equal(error.parse() instanceof z.ZodError, true);
});

test("parseError returns parsed application errors or unexpected errors", () => {
    assert.deepEqual(
        parseError(
            new ApplicationError(miscCodes.internalServerError, {
                code: miscCodes.internalServerError,
            })
        ),
        {
            code: miscCodes.internalServerError,
        }
    );

    const invalidApplicationError = new ApplicationError(
        mediaCodes.mediaTooLarge,
        {
            mediaID: "large-file.mov",
        }
    );
    const parsedInvalidError = parseError(invalidApplicationError);

    assert.equal(parsedInvalidError.code, miscCodes.zodError);
    assert.equal(parsedInvalidError.error instanceof z.ZodError, true);

    assert.deepEqual(parseError(new Error("boom")), {
        code: miscCodes.unexpectedError,
        debugMessage: "Error: boom",
    });
    assert.deepEqual(parseError("boom"), {
        code: miscCodes.unexpectedError,
        debugMessage: "boom",
    });
});

test("normalizeError maps override codes to their stable parent code", () => {
    const errs: ErrorDetails[] = [
        {
            code: miscCodes.invalidResponseShape,
            debugMessage: "bad payload",
            payload: {},
        },
        {
            code: reqParamsCodes.invalidID,
            key: "workspaceID",
        },
        {
            code: middlewareCodes.invalidAuthHeader,
        },
    ];

    for (const err of errs) {
        assert.deepEqual(normalizeError(err), {
            code: miscCodes.unexpectedError,
            debugMessage: JSON.stringify(err),
        });
    }
});
