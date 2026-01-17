import { APIError, newAPIErrorResponse } from "../errors";
import type { DecodeAPIResponse } from "./types";

export const decodeAPIResponse: DecodeAPIResponse = async (res, schema) => {
  const text = await res.text();

  if (!text) {
    if (res.ok) {
      return null;
    }
    throw new APIError(res, { message: "Empty error response from server" });
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
        message: "Invalid response shape from server",
      });
    }

    return parsed.data;
  }

  const errRes = newAPIErrorResponse(payload);
  throw new APIError(res, errRes);
};
