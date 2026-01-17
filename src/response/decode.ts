import { APIError, newAPIErrorResponse } from "../errors";
import type { DecodeAPIResponse } from "./types";

export const decodeAPIResponse: DecodeAPIResponse = async (res) => {
  const text = await res.text();

  if (!text) {
    if (res.ok) {
      return null;
    }
    throw new APIError(res, { message: "Empty error response from server" });
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    const message = res.ok
      ? "Malformed JSON response from server"
      : "Malformed error response from server";
    throw new APIError(res, { message });
  }

  if (res.ok) {
    return payload;
  }

  const errRes = newAPIErrorResponse(payload);
  throw new APIError(res, errRes);
};
