import * as z from "zod";

export const APIErrorResponseSchema = z.object({
  message: z.string().optional(),
  fieldErrors: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
});

export type APIErrorResponse = z.infer<typeof APIErrorResponseSchema>;

export type NewApiErrorResponse = (res: unknown) => APIErrorResponse;

export type ErrorCode =
  | "server-error"
  | "network-error"
  | "too-many-requests-error"
  | "authentication-error"
  | "authorization-error"
  | "not-found-error"
  | "method-not-allowed-error"
  | "form-field-error"
  | "user-action-error"
  | "content-too-large-error"
  | "unknown-error";
