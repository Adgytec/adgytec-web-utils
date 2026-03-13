import type { z } from "zod";

export type ErrorSchemaType = z.ZodObject<{ code: z.ZodLiteral<string> }>;

export type FieldErrorSchemaType = z.ZodObject<{ type: z.ZodLiteral<string> }>;

export type InvalidSchemaType = z.ZodObject<{ cause: z.ZodLiteral<string> }>;

export type NewErrorSchema = {
    errorSchemas?: ErrorSchemaType[];
    invalidFieldSchemas?: InvalidSchemaType[];
};

export type NonEmptyArray<T> = [T, ...T[]];
