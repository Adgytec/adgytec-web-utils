import { APIError, newAPIErrorResponse } from "../errors";
import { z } from "zod";

// overloaded functions
export function decodeAPIResponse<T>(
  res: Response,
  schema: z.ZodSchema<T>,
): Promise<T>;

export function decodeAPIResponse(res: Response): Promise<null>;

export async function decodeAPIResponse<T>(
  res: Response,
  schema?: z.ZodSchema<T>,
): Promise<T | null> {
  const text = await res.text();

  // Empty body
  if (!text) {
    if (res.ok) {
      if (schema) {
        throw new APIError(res, {
          message: "Expected response body but received empty response",
        });
      }
      return null;
    }

    throw new APIError(res, {
      message: "Empty error response from server",
    });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    const message = res.ok
      ? "Malformed JSON response from server"
      : "Malformed error response from server";
    throw new APIError(res, { message });
  }

  // ✅ Success path
  if (res.ok) {
    if (!schema) {
      // caller explicitly expects no response value
      return null;
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new APIError(res, {
        message: `Invalid response shape from server: ${parsed.error.message}`,
      });
    }

    return parsed.data;
  }

  const errRes = newAPIErrorResponse(payload);
  throw new APIError(res, errRes);
}
