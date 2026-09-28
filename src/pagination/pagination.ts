import { z } from "zod";

/**
 * Schema validating search parameters used to paginate the result set.
 */
export const PageSearchSchema = z.object({
    key: z.string(),
    value: z.string(),
});

/**
 * Describes the search parameter used to paginate the result set.
 */
export type PageSearch = z.infer<typeof PageSearchSchema>;

/**
 * Schema validating the cursor position and direction used to fetch the page.
 */
export const PageSourceCursorSchema = z.object({
    value: z.string(),
    direction: z.string(),
});

/**
 * Describes the cursor position and direction used to fetch the page.
 */
export type PageSourceCursor = z.infer<typeof PageSourceCursorSchema>;

/**
 * Schema validating the pagination parameters used to fetch the current page.
 */
export const PageSourceSchema = z.object({
    cursor: PageSourceCursorSchema.nullable(),
    order: z.string(),
    search: PageSearchSchema.nullable(),
    limit: z.int(),
    filters: z.record(z.string(), z.string()).nullable(),
});

/**
 * Describes the pagination parameters used to fetch the current page.
 */
export type PageSource = z.infer<typeof PageSourceSchema>;

/**
 * Schema validating metadata about the current page and the cursor for the next page.
 */
export const PageInfoSchema = z.object({
    hasNextPage: z.boolean(),
    cursor: z.string().nullable(),
    source: PageSourceSchema,
});

/**
 * Contains metadata about the current page and the cursor for the next page.
 */
export type PageInfo = z.infer<typeof PageInfoSchema>;

/**
 * Generates a schema associating an item with the cursor representing its position in the result set.
 *
 * @param itemSchema - The Zod schema used to validate each individual item.
 */
export const PageItemWithCursorSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        cursor: z.string(),
        item: itemSchema,
    });

/**
 * Associates an item with the cursor representing its position in the result set.
 */
export type PageItemWithCursor<T extends z.ZodType> = {
    cursor: string;
    item: z.output<T>;
};

/**
 * Generates the root schema for paginated responses, containing the paginated items
 * and metadata describing the current page and its pagination state.
 *
 * @param itemSchema - The Zod schema used to validate each individual item in the page.
 */
export const PageSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        pageInfo: PageInfoSchema,
        page: z.array(PageItemWithCursorSchema(itemSchema)),
    });

/**
 * Contains the paginated items and metadata describing the current page and its pagination state.
 */
export type Page<T extends z.ZodType> = {
    pageInfo: PageInfo;
    page: PageItemWithCursor<T>[];
};
