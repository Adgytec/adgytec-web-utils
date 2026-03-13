import type { z } from "zod";

export type InvalidSchemaType = z.ZodObject<{ cause: z.ZodLiteral<string> }>;

export type NonEmptyArray<T> = [T, ...T[]];
