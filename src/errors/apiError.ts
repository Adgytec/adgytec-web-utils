import { BaseError } from "./baseError";
import {
  APIErrorResponseSchema,
  type APIErrorResponse,
  type NewAPIErrorResponse,
} from "./types";

export const newAPIErrorResponse: NewAPIErrorResponse = (res) => {
  const result = APIErrorResponseSchema.safeParse(res);

  // if both fields are missing treat as server bug
  if (!result.success || (!result.data.message && !result.data.fieldErrors)) {
    return {
      message: "Unexpected server error",
    };
  }

  return result.data;
};

export class APIError extends BaseError {
  data: APIErrorResponse;
  response: Response;

  constructor(response: Response, data: APIErrorResponse) {
    super(data.message ?? "API Error");

    this.name = "API Error";
    this.data = data;
    this.response = response;
  }
}
