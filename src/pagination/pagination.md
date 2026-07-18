# Pagination

Utilities and schemas for implementing cursor-based pagination.

These models provide a standard, type-safe contract for building and consuming cursor-paginated APIs. They are also available as Zod schemas for runtime validation.

---

## Schemas

### `PageInfoSchema`

Represents metadata about the current page.

```ts
const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  nextCursor: z.string().nullable(),
  hasPrevPage: z.boolean(),
  prevCursor: z.string().nullable(),
});
```

### `PageItemWithCursorSchema`

Creates a schema for a paginated item.

```ts
const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
});

const ProductPageItemSchema = PageItemWithCursorSchema(ProductSchema);
```

### `PageSchema`

Creates a schema for a complete paginated response.

```ts
const ProductPageSchema = PageSchema(ProductSchema);
```

---

## Types

All pagination types are inferred directly from the corresponding schemas.

### `PageInfo`

```ts
type PageInfo = z.infer<typeof PageInfoSchema>;
```

### `PageItemWithCursor<T>`

```ts
type PageItemWithCursor<T extends z.ZodType> =
  z.infer<ReturnType<typeof PageItemWithCursorSchema<T>>>;
```

### `Page<T>`

```ts
type Page<T extends z.ZodType> =
  z.infer<ReturnType<typeof PageSchema<T>>>;
```

---

## Errors and Validation

When handling invalid cursor requests (for example, malformed cursor values or expired cursor encodings), the server may return an error conforming to:

- **Error Code:** `"invalid-cursor-value"`
- **Schema:** `invalidCursorValueSchema`

---

## Example Usage

```ts
import { z } from "zod";
import {
  PageSchema,
  type Page,
} from "@adgytec/adgytec-web-utils";

const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
});

type ProductPage = Page<typeof ProductSchema>;

async function fetchProducts(
  cursor: string | null = null,
): Promise<ProductPage> {
  const url = new URL("/api/products", window.location.origin);

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  url.searchParams.set("limit", "20");

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return PageSchema(ProductSchema).parse(await res.json());
}
```
