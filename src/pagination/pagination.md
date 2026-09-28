# Pagination

Exports from `src/pagination`.

Models and Zod validation schemas for cursor-based pagination.

These models and schemas provide a standard, type-safe contract for building, validating, and consuming cursor-paginated APIs.

---

## Schemas & Types Overview

| Schema | Type | Description |
| --- | --- | --- |
| `PageSearchSchema` | `PageSearch` | Search parameters applied to a query (`key` and `value`). |
| `PageSourceCursorSchema` | `PageSourceCursor` | Origin cursor token (`value`) and navigation `direction`. |
| `PageSourceSchema` | `PageSource` | Source query parameters that generated the page (cursor, order, search, limit, filters). |
| `PageInfoSchema` | `PageInfo` | Pagination state, next-page indicator, cursor pointer, and source query metadata. |
| `PageItemWithCursorSchema(itemSchema)` | `PageItemWithCursor<T>` | Individual item paired with its cursor token. |
| `PageSchema(itemSchema)` | `Page<T>` | Root paginated response containing `pageInfo` and the `page` items array. |

---

## Models & Schemas

### `PageSearchSchema` & `PageSearch`

Validates search parameters applied to a paginated query.

```ts
export const PageSearchSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export type PageSearch = z.infer<typeof PageSearchSchema>;
```

#### Fields

- `key` (`string`): The field or attribute key targeted by the search.
- `value` (`string`): The search query term.

---

### `PageSourceCursorSchema` & `PageSourceCursor`

Represents the cursor parameter and navigation direction from which the current page query was sourced.

```ts
export const PageSourceCursorSchema = z.object({
  value: z.string(),
  direction: z.string(),
});

export type PageSourceCursor = z.infer<typeof PageSourceCursorSchema>;
```

#### Fields

- `value` (`string`): The opaque cursor string or pointer value.
- `direction` (`string`): The navigation direction (e.g., `"next"`, `"prev"`).

---

### `PageSourceSchema` & `PageSource`

Encapsulates the complete set of query parameters that produced the current page.

```ts
export const PageSourceSchema = z.object({
  cursor: PageSourceCursorSchema.nullable(),
  order: z.string(),
  search: PageSearchSchema.nullable(),
  limit: z.number().int(),
  filters: z.record(z.string(), z.string()).nullable(),
});

export type PageSource = z.infer<typeof PageSourceSchema>;
```

#### Fields

- `cursor` (`PageSourceCursor | null`): The cursor used to fetch this page, or `null` if fetching from the beginning.
- `order` (`string`): Sort ordering applied to the query (e.g., `"asc"`, `"desc"`).
- `search` (`PageSearch | null`): The search criteria applied to the query, or `null` if no search was applied.
- `limit` (`number`): The maximum number of items requested (integer).
- `filters` (`Record<string, string> | null`): Key-value map of additional query filters, or `null` if none were applied.

---

### `PageInfoSchema` & `PageInfo`

Contains metadata about the current page, next-page availability, cursor navigation, and the originating query source parameters.

```ts
export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  cursor: z.string().nullable(),
  source: PageSourceSchema,
});

export type PageInfo = z.infer<typeof PageInfoSchema>;
```

#### Fields

- `hasNextPage` (`boolean`): Indicates whether subsequent items are available.
- `cursor` (`string | null`): The cursor token to fetch the next page, or `null` if there is no next page.
- `source` (`PageSource`): The source query parameters that generated this page.

---

### `PageItemWithCursorSchema` & `PageItemWithCursor<T>`

A wrapper for an individual item accompanied by its granular cursor token, allowing item-level cursor tracking or deep linking.

```ts
export const PageItemWithCursorSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    cursor: z.string(),
    item: itemSchema,
  });

export type PageItemWithCursor<T extends z.ZodType> = {
  readonly cursor: string;
  readonly item: z.output<T>;
};
```

#### Fields

- `cursor` (`string`): The cursor token corresponding to this specific item.
- `item` (`z.output<T>`): The validated item payload conforming to the provided `itemSchema`.

---

### `PageSchema` & `Page<T>`

The standard root response schema factory and TypeScript model for a paginated list endpoint.

```ts
export const PageSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    pageInfo: PageInfoSchema,
    page: z.array(PageItemWithCursorSchema(itemSchema)),
  });

export type Page<T extends z.ZodType> = {
  readonly pageInfo: PageInfo;
  readonly page: readonly PageItemWithCursor<T>[];
};
```

#### Fields

- `pageInfo` (`PageInfo`): Page navigation metadata and the source query state.
- `page` (`readonly PageItemWithCursor<T>[]`): An array of cursor-wrapped items.

---

## Errors and Validation

When handling invalid cursor requests (e.g., malformed cursor string, expired token encoding in cursor), the server may return an error conforming to `invalidCursorValueSchema`:

- **Error Code**: `"invalid-cursor-value"`
- **Schema**: `invalidCursorValueSchema`

Refer to [errorSchema.md](../errorSchema/errorSchema.md) and [errorCodes.md](../errorCodes/errorCodes.md) for full error handling details.

---

## Example Usage

### 1. Fetching and Validating with `decodeAPIResponse`

Use `PageSchema` together with `decodeAPIResponse` to fetch and validate paginated data in a single type-safe step:

```ts
import { decodeAPIResponse, PageSchema, type Page } from "adgytec-web-utils";
import { z } from "zod";

// Define schema for individual items
const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
});

type ProductPage = Page<typeof ProductSchema>;

async function fetchProducts(cursor: string | null = null): Promise<ProductPage> {
  const url = new URL("/api/products", window.location.origin);
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }
  url.searchParams.set("limit", "20");

  const res = await fetch(url.toString());
  return decodeAPIResponse(res, PageSchema(ProductSchema));
}
```

### 2. Consuming Paginated Data & Walking Pages

```ts
async function loadAllProducts() {
  let nextCursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const pageData = await fetchProducts(nextCursor);

    // Iterate through items
    for (const { cursor, item } of pageData.page) {
      console.log(`Product: ${item.title} ($${item.price}) [cursor: ${cursor}]`);
    }

    // Advance pagination state
    hasMore = pageData.pageInfo.hasNextPage;
    nextCursor = pageData.pageInfo.cursor;
  }
}
```

### 3. Parsing Raw Payloads Directly

```ts
import { PageSchema } from "adgytec-web-utils";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const rawResponse = {
  pageInfo: {
    hasNextPage: true,
    cursor: "cursor_xyz789",
    source: {
      cursor: null,
      order: "asc",
      search: { key: "name", value: "alice" },
      limit: 10,
      filters: { role: "admin" },
    },
  },
  page: [
    {
      cursor: "cursor_abc123",
      item: { id: "u-1", name: "Alice" },
    },
  ],
};

const result = PageSchema(UserSchema).safeParse(rawResponse);
if (result.success) {
  console.log("Parsed page:", result.data);
} else {
  console.error("Validation failed:", result.error);
}
```
