import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import * as z from "zod";
import type { FieldNode } from "../src/errorSchema";
import { flattenFieldNodes, validateAndGetFormValues } from "../src/forms";

const originalFormData = globalThis.FormData;

afterEach(() => {
    globalThis.FormData = originalFormData;
});

const mockFormData = (entries: [string, FormDataEntryValue][]) => {
    globalThis.FormData = class {
        *[Symbol.iterator]() {
            yield* entries;
        }
    } as typeof FormData;
};

test("validateAndGetFormValues returns zod failures using the form validation error schema", () => {
    mockFormData([
        ["email", "not-email"],
        ["website", "not-url"],
        ["status", "archived"],
        ["name", "a"],
        ["pin", "12"],
        ["nickname", "Adgytec"],
    ]);

    const schema = z.object({
        email: z.email(),
        website: z.url(),
        status: z.enum(["active", "paused"]),
        name: z.string().min(2),
        pin: z.string().length(4),
        missingField: z.string(),
        nickname: z.string().max(4),
    });

    const result = validateAndGetFormValues({} as HTMLFormElement, schema);

    assert.equal(result.success, false);
    if (result.success) {
        return;
    }

    // Verify error codes and structures directly to keep the test decoupled from package constants
    assert.ok(result.errors.email);
    assert.equal(result.errors.email[0].code, "invalid_format");
    assert.equal(
        (result.errors.email[0] as unknown as Record<string, unknown>).format,
        "email"
    );

    assert.ok(result.errors.website);
    assert.equal(result.errors.website[0].code, "invalid_format");
    assert.equal(
        (result.errors.website[0] as unknown as Record<string, unknown>).format,
        "url"
    );

    assert.ok(result.errors.status);
    assert.equal(result.errors.status[0].code, "invalid_value");
    assert.deepEqual(
        (result.errors.status[0] as unknown as Record<string, unknown>).values,
        ["active", "paused"]
    );

    assert.ok(result.errors.name);
    assert.equal(result.errors.name[0].code, "string_too_short");
    assert.equal(
        (result.errors.name[0] as unknown as Record<string, unknown>).minimum,
        2
    );

    assert.ok(result.errors.pin);
    assert.equal(result.errors.pin[0].code, "string_too_short");
    assert.equal(
        (result.errors.pin[0] as unknown as Record<string, unknown>).minimum,
        4
    );

    assert.ok(result.errors.missingField);
    assert.equal(result.errors.missingField[0].code, "invalid_type");
    assert.equal(
        (result.errors.missingField[0] as unknown as Record<string, unknown>)
            .expected,
        "string"
    );

    assert.ok(result.errors.nickname);
    assert.equal(result.errors.nickname[0].code, "string_too_long");
    assert.equal(
        (result.errors.nickname[0] as unknown as Record<string, unknown>)
            .maximum,
        4
    );
});

test("validateAndGetFormValues returns parsed data on success", () => {
    mockFormData([
        ["email", "team@adgytec.in"],
        ["status", "active"],
    ]);

    const schema = z.object({
        email: z.email(),
        status: z.enum(["active", "paused"]),
    });

    assert.deepEqual(validateAndGetFormValues({} as HTMLFormElement, schema), {
        success: true,
        data: {
            email: "team@adgytec.in",
            status: "active",
        },
    });
});

test("flattenFieldNodes converts nested form field errors into dotted keys", () => {
    const nodes: FieldNode[] = [
        {
            key: "profile",
            children: [
                {
                    key: "email",
                    errors: [
                        {
                            code: "validation_is_email",
                            debugMessage: "Invalid email address",
                        },
                    ],
                },
                {
                    key: "address",
                    children: [
                        {
                            key: "zip",
                            errors: [
                                {
                                    code: "validation_required",
                                    debugMessage: "Zip code is required",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    assert.deepEqual(flattenFieldNodes(nodes), {
        "profile.email": [
            {
                code: "validation_is_email",
                debugMessage: "Invalid email address",
            },
        ],
        "profile.address.zip": [
            {
                code: "validation_required",
                debugMessage: "Zip code is required",
            },
        ],
    });
});
