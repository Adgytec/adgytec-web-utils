import { APIErrorResponseSchema, type NewApiErrorResponse } from "./types";

export const newAPIErrorResponse: NewApiErrorResponse = (res) => {
  const result = APIErrorResponseSchema.safeParse(res);

  // if both fields are missing treat as server bug
  if (!result.success || (!result.data.message && !result.data.fieldErrors)) {
    return {
      message: "Unexpected server error",
    };
  }

  return result.data;
};
