import assert from "node:assert/strict";
import { test } from "node:test";
import * as z from "zod";
import { commonCodes, mediaCodes, serverCodes } from "../src/errorCodes";
import { ApplicationError, normalizeError, parseError } from "../src/errors";

test("ApplicationError stores details and parses known error schemas", () => {
    const error = new ApplicationError(mediaCodes.mediaTooLarge, {
        mediaID: "large-file.mov",
        currentSize: 20,
        maxSupportedSize: 10,
    });

    assert.equal(error.code, mediaCodes.mediaTooLarge);
    assert.deepEqual(error.details, {
        code: mediaCodes.mediaTooLarge,
        mediaID: "large-file.mov",
        currentSize: 20,
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
            new ApplicationError(serverCodes.internalServerError, {
                code: serverCodes.internalServerError,
            })
        ),
        {
            code: serverCodes.internalServerError,
        }
    );

    const invalidApplicationError = new ApplicationError(
        mediaCodes.mediaTooLarge,
        {
            mediaID: "large-file.mov",
        }
    );
    const parsedInvalidError = parseError(invalidApplicationError);

    assert.equal(parsedInvalidError.code, commonCodes.zodError);
    assert.equal(parsedInvalidError.error instanceof z.ZodError, true);

    assert.deepEqual(parseError(new Error("boom")), {
        code: commonCodes.unexpectedError,
        debugMessage: "Error: boom",
    });
    assert.deepEqual(parseError("boom"), {
        code: commonCodes.unexpectedError,
        debugMessage: "boom",
    });
});

test("normalizeError maps override codes to their stable parent code", () => {
    assert.deepEqual(
        normalizeError({
            code: serverCodes.invalidResponseShape,
            message: "bad payload",
            payload: {},
        }),
        {
            code: commonCodes.unexpectedError,
        }
    );

    assert.deepEqual(
        normalizeError({
            code: mediaCodes.missingETagValue,
            mediaID: "0198a0e9-903c-7d4f-8246-317022e6523b",
            partNumber: 1,
        }),
        {
            code: mediaCodes.mediaUploadError,
        }
    );

    assert.deepEqual(
        normalizeError({
            code: mediaCodes.mediaTooLarge,
            mediaID: "large-file.mov",
            currentSize: 20,
            maxSupportedSize: 10,
        }),
        {
            code: mediaCodes.mediaTooLarge,
            mediaID: "large-file.mov",
            currentSize: 20,
            maxSupportedSize: 10,
        }
    );
});
