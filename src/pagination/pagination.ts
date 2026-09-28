import { z } from "zod";

export const PageSearchSchema = z.object({
    key: z.string(),
    value: z.string(),
});

export type PageSearch = z.infer<typeof PageSearchSchema>;

export const PageSourceCursorSchema = z.object({
    value: z.string(),
    direction: z.string(),
});

export type PageSourceCursor = z.infer<typeof PageSourceCursorSchema>;

export const PageSourceSchema = z.object({
    cursor: PageSourceCursorSchema.nullable(),
    order: z.string(),
    search: PageSearchSchema.nullable(),
    limit: z.number().int(),
    filters: z.record(z.string(), z.string()).nullable(),
});

export type PageSource = z.infer<typeof PageSourceSchema>;

export const PageInfoSchema = z.object({
    hasNextPage: z.boolean(),
    cursor: z.string().nullable(),
    source: PageSourceSchema,
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

export const PageItemWithCursorSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        cursor: z.string(),
        item: itemSchema,
    });

export type PageItemWithCursor<T extends z.ZodType> = {
    readonly cursor: string;
    readonly item: z.output<T>;
};

export const PageSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        pageInfo: PageInfoSchema,
        page: z.array(PageItemWithCursorSchema(itemSchema)),
    });

export type Page<T extends z.ZodType> = {
    readonly pageInfo: PageInfo;
    readonly page: readonly PageItemWithCursor<T>[];
};
