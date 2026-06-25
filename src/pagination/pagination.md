# Pagination

Models and types for cursor-based pagination.

These models provide a standard, type-safe contract for building and consuming cursor-paginated APIs.

---

## Models

### `PageInfo`

Contains metadata about the current page's position and navigation links.

```ts
export type PageInfo = {
  readonly hasNextPage: boolean;
  readonly nextCursor: string | null;
  readonly hasPrevPage: boolean;
  readonly prevCursor: string | null;
};
```

### `PageItemWithCursor`

A single item in the page accompanied by its cursor, allowing granular cursor reference.

```ts
export type PageItemWithCursor<T> = {
  readonly cursor: string;
  readonly item: T;
};
```

### `Page`

The standard response model for a paginated list endpoint.

```ts
export type Page<T> = {
  readonly pageInfo: PageInfo;
  readonly pageItems: readonly PageItemWithCursor<T>[];
};
```

---

## Errors and Validation

When handling invalid cursor requests (e.g., malformed cursor string, expired token encoding in cursor), the server may return an error conforming to the `invalidCursorValueSchema`:

- **Error Code**: `"invalid-cursor-value"`
- **Schema**: `invalidCursorValueSchema`

---

## Example Usage

```ts
import type { Page } from "adgytec-web-utils";

interface Product {
  id: string;
  title: string;
  price: number;
}

async function fetchProducts(cursor: string | null = null): Promise<Page<Product>> {
  const url = new URL("/api/products", window.location.origin);
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }
  url.searchParams.set("limit", "20");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}
```
