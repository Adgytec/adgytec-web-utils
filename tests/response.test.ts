import assert from "node:assert/strict";
import { test } from "node:test";
import * as z from "zod";
import { httpReqHeaders } from "../src/constants";
import { mediaCodes, serverCodes } from "../src/errorCodes";
import { ApplicationError } from "../src/errors";
import { decodeAPIResponse } from "../src/response";

const jsonHeaders = {
    [httpReqHeaders.contentType.key]:
        httpReqHeaders.contentType.valueApplicationJSON,
};

test("decodeAPIResponse returns null for successful responses without a schema", async () => {
    await assert.doesNotReject(async () => {
        assert.equal(await decodeAPIResponse(new Response(null)), null);
    });
});

test("decodeAPIResponse parses successful JSON responses with a schema", async () => {
    const schema = z.object({
        id: z.string(),
        count: z.number(),
    });
    const response = new Response(JSON.stringify({ id: "abc", count: 2 }), {
        headers: jsonHeaders,
    });

    assert.deepEqual(await decodeAPIResponse(response, schema), {
        id: "abc",
        count: 2,
    });
});

test("decodeAPIResponse rejects invalid success payload shapes", async () => {
    const schema = z.object({
        id: z.string(),
    });
    const response = new Response(JSON.stringify({ id: 12 }), {
        headers: jsonHeaders,
    });

    await assert.rejects(
        () => decodeAPIResponse(response, schema),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);
            assert.equal(
                (error as ApplicationError).code,
                serverCodes.invalidResponseShape
            );

            return true;
        }
    );
});

test("decodeAPIResponse rejects malformed and non-JSON response bodies", async () => {
    const schema = z.object({
        id: z.string(),
    });

    await assert.rejects(
        () =>
            decodeAPIResponse(
                new Response("{", { headers: jsonHeaders }),
                schema
            ),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);
            assert.equal(
                (error as ApplicationError).code,
                serverCodes.malformedJsonFromServer
            );

            return true;
        }
    );

    await assert.rejects(
        () =>
            decodeAPIResponse(
                new Response("plain text", {
                    headers: { [httpReqHeaders.contentType.key]: "text/plain" },
                }),
                schema
            ),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);
            assert.equal(
                (error as ApplicationError).code,
                serverCodes.invalidResponseShape
            );

            return true;
        }
    );
});

test("decodeAPIResponse converts error responses into ApplicationError instances", async () => {
    await assert.rejects(
        () =>
            decodeAPIResponse(
                new Response(
                    JSON.stringify({
                        code: mediaCodes.mediaObjectNotFound,
                    }),
                    {
                        status: 404,
                        headers: jsonHeaders,
                    }
                )
            ),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);
            assert.equal(
                (error as ApplicationError).code,
                mediaCodes.mediaObjectNotFound
            );

            return true;
        }
    );

    await assert.rejects(
        () => decodeAPIResponse(new Response(null, { status: 500 })),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);
            assert.equal(
                (error as ApplicationError).code,
                serverCodes.internalServerError
            );

            return true;
        }
    );

    await assert.rejects(
        () => decodeAPIResponse(new Response(null, { status: 400 })),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);
            assert.equal(
                (error as ApplicationError).code,
                serverCodes.unknownServerError
            );

            return true;
        }
    );
});
