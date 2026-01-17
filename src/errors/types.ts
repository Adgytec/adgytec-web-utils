import * as z from "zod";

export const APIErrorResponseSchema = z.object({
  message: z.string().optional(),
  fieldErrors: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
});

export type APIErrorResponse = z.infer<typeof APIErrorResponseSchema>;

export type NewApiErrorResponse = (res: unknown) => APIErrorResponse;
