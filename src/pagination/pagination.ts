import { z } from "zod";

export const PageInfoSchema = z.object({
    hasNextPage: z.boolean(),
    nextCursor: z.string().nullable(),
    hasPrevPage: z.boolean(),
    prevCursor: z.string().nullable(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

export const PageItemWithCursorSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        cursor: z.string(),
        item: itemSchema,
    });

export type PageItemWithCursor<T extends z.ZodType> = z.infer<
    ReturnType<typeof PageItemWithCursorSchema<T>>
>;

export const PageSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        pageInfo: PageInfoSchema,
        pageItems: z.array(PageItemWithCursorSchema(itemSchema)),
    });

export type Page<T extends z.ZodType> = z.infer<
    ReturnType<typeof PageSchema<T>>
>;
