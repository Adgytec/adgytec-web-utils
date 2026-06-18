import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import * as z from "zod";
import { formFieldInvalidTypeCauses, formFieldTypes } from "../src/errorCodes";
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

    assert.deepEqual(result.errors, {
        email: [
            {
                type: formFieldTypes.invalid,
                details: {
                    cause: formFieldInvalidTypeCauses.invalidEmail,
                },
            },
        ],
        website: [
            {
                type: formFieldTypes.invalid,
                details: {
                    cause: formFieldInvalidTypeCauses.invalidUrl,
                },
            },
        ],
        status: [
            {
                type: formFieldTypes.invalid,
                details: {
                    cause: formFieldInvalidTypeCauses.invalidEnumValue,
                    possibleValues: ["active", "paused"],
                },
            },
        ],
        name: [
            {
                type: formFieldTypes.underflow,
                details: {
                    min: 2,
                },
            },
        ],
        pin: [
            {
                type: formFieldTypes.length,
                details: {
                    min: 4,
                    max: 4,
                },
            },
        ],
        missingField: [
            {
                type: formFieldTypes.missing,
            },
        ],
        nickname: [
            {
                type: formFieldTypes.overflow,
                details: {
                    max: 4,
                },
            },
        ],
    });
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
                            type: formFieldTypes.invalid,
                            details: {
                                cause: formFieldInvalidTypeCauses.invalidEmail,
                            },
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
                                    type: formFieldTypes.missing,
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
                type: formFieldTypes.invalid,
                details: {
                    cause: formFieldInvalidTypeCauses.invalidEmail,
                },
            },
        ],
        "profile.address.zip": [
            {
                type: formFieldTypes.missing,
            },
        ],
    });
});
