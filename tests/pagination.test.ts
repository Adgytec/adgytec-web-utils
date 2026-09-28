import assert from "node:assert/strict";
import { test } from "node:test";
import { z } from "zod";
import { miscCodes } from "../src/errorCodes";
import { ApplicationError } from "../src/errors";
import {
    type Page,
    type PageInfo,
    PageInfoSchema,
    PageItemWithCursorSchema,
    PageSchema,
    PageSearchSchema,
    PageSourceCursorSchema,
    PageSourceSchema,
} from "../src/pagination";
import { decodeAPIResponse } from "../src/response";

const SampleItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
});

test("PageSearchSchema parses valid search parameters and rejects invalid types", () => {
    const valid = { key: "title", value: "keyboard" };
    const parsed = PageSearchSchema.parse(valid);
    assert.deepEqual(parsed, valid);

    assert.throws(() =>
        PageSearchSchema.parse({ key: 123, value: "keyboard" })
    );
    assert.throws(() => PageSearchSchema.parse({ key: "title" }));
});

test("PageSourceCursorSchema parses cursor value and direction", () => {
    const valid = { value: "cursor-token-abc", direction: "next" };
    const parsed = PageSourceCursorSchema.parse(valid);
    assert.deepEqual(parsed, valid);

    assert.throws(() =>
        PageSourceCursorSchema.parse({ value: "cursor-token-abc" })
    );
    assert.throws(() =>
        PageSourceCursorSchema.parse({ value: 123, direction: "next" })
    );
});

test("PageSourceSchema parses complete parameters and handles nullable fields from backend Go schema", () => {
    const populatedSource = {
        cursor: { value: "cur-1", direction: "next" },
        order: "asc",
        search: { key: "category", value: "electronics" },
        limit: 25,
        filters: { inStock: "true", status: "active" },
    };

    const parsedPopulated = PageSourceSchema.parse(populatedSource);
    assert.deepEqual(parsedPopulated, populatedSource);

    // Initial page query where pointer fields (*PageSourceCursor, *PageSearch, map) in Go are nil -> null in JSON
    const initialSource = {
        cursor: null,
        order: "desc",
        search: null,
        limit: 10,
        filters: null,
    };

    const parsedInitial = PageSourceSchema.parse(initialSource);
    assert.deepEqual(parsedInitial, initialSource);

    // Rejects non-integer limit
    assert.throws(() =>
        PageSourceSchema.parse({
            ...initialSource,
            limit: 10.5,
        })
    );

    // Rejects missing required field
    assert.throws(() =>
        PageSourceSchema.parse({
            cursor: null,
            order: "asc",
            limit: 10,
            filters: null,
        })
    );
});

test("PageInfoSchema parses valid page metadata and supports null cursor", () => {
    const pageInfoWithNext: PageInfo = {
        hasNextPage: true,
        cursor: "next-cursor-xyz",
        source: {
            cursor: { value: "cur-0", direction: "next" },
            order: "asc",
            search: null,
            limit: 20,
            filters: null,
        },
    };

    assert.deepEqual(PageInfoSchema.parse(pageInfoWithNext), pageInfoWithNext);

    const pageInfoLastPage: PageInfo = {
        hasNextPage: false,
        cursor: null,
        source: {
            cursor: { value: "cur-1", direction: "next" },
            order: "asc",
            search: null,
            limit: 20,
            filters: null,
        },
    };

    assert.deepEqual(PageInfoSchema.parse(pageInfoLastPage), pageInfoLastPage);

    // Rejects non-boolean hasNextPage
    assert.throws(() =>
        PageInfoSchema.parse({
            ...pageInfoWithNext,
            hasNextPage: "true",
        })
    );
});

test("PageItemWithCursorSchema wraps item with cursor and enforces item schema", () => {
    const itemSchema = PageItemWithCursorSchema(SampleItemSchema);

    const validItem = {
        cursor: "item-cursor-1",
        item: { id: "item-1", name: "Mechanical Keyboard", price: 120 },
    };

    assert.deepEqual(itemSchema.parse(validItem), validItem);

    // Rejects item that violates inner schema
    assert.throws(() =>
        itemSchema.parse({
            cursor: "item-cursor-1",
            item: {
                id: "item-1",
                name: "Mechanical Keyboard",
                price: "one hundred",
            },
        })
    );

    // Rejects missing cursor
    assert.throws(() =>
        itemSchema.parse({
            item: { id: "item-1", name: "Mechanical Keyboard", price: 120 },
        })
    );
});

test("PageSchema validates full backend Page[T] responses including empty pages", () => {
    const PageOfProductsSchema = PageSchema(SampleItemSchema);

    const populatedResponse: Page<typeof SampleItemSchema> = {
        pageInfo: {
            hasNextPage: true,
            cursor: "cursor-page-2",
            source: {
                cursor: null,
                order: "asc",
                search: { key: "name", value: "mouse" },
                limit: 2,
                filters: { brand: "logitech" },
            },
        },
        page: [
            {
                cursor: "cur-item-1",
                item: { id: "p1", name: "Wireless Mouse", price: 45 },
            },
            {
                cursor: "cur-item-2",
                item: { id: "p2", name: "Gaming Mouse", price: 75 },
            },
        ],
    };

    const parsed = PageOfProductsSchema.parse(populatedResponse);
    assert.deepEqual(parsed, populatedResponse);

    // Empty page validation
    const emptyResponse: Page<typeof SampleItemSchema> = {
        pageInfo: {
            hasNextPage: false,
            cursor: null,
            source: {
                cursor: { value: "last-cur", direction: "next" },
                order: "asc",
                search: null,
                limit: 10,
                filters: null,
            },
        },
        page: [],
    };

    const parsedEmpty = PageOfProductsSchema.parse(emptyResponse);
    assert.deepEqual(parsedEmpty, emptyResponse);

    // Rejects invalid item in page list
    assert.throws(() =>
        PageOfProductsSchema.parse({
            ...populatedResponse,
            page: [
                {
                    cursor: "cur-invalid",
                    item: { id: "p3" }, // missing name and price
                },
            ],
        })
    );
});

test("PageSchema integrates with decodeAPIResponse for native fetch responses", async () => {
    const PageOfProductsSchema = PageSchema(SampleItemSchema);

    const backendPayload: Page<typeof SampleItemSchema> = {
        pageInfo: {
            hasNextPage: false,
            cursor: null,
            source: {
                cursor: null,
                order: "asc",
                search: null,
                limit: 10,
                filters: null,
            },
        },
        page: [
            {
                cursor: "cur-item-1",
                item: { id: "p1", name: "Trackpad", price: 99 },
            },
        ],
    };

    const response = new Response(JSON.stringify(backendPayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

    const decoded = await decodeAPIResponse(response, PageOfProductsSchema);
    assert.deepEqual(decoded, backendPayload);

    // Fails decodeAPIResponse when payload violates PageSchema
    const invalidResponse = new Response(JSON.stringify({ pageInfo: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

    await assert.rejects(
        () => decodeAPIResponse(invalidResponse, PageOfProductsSchema),
        (err) => {
            assert.equal(err instanceof ApplicationError, true);
            assert.equal(
                (err as ApplicationError).code,
                miscCodes.invalidResponseShape
            );
            return true;
        }
    );
});
