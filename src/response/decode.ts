import { APIError, newAPIErrorResponse } from "../errors";
import type { DecodeAPIResponse } from "./types";

export const decodeAPIResponse: DecodeAPIResponse = async (res) => {
  const text = await res.text();

  if (res.ok) {
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      throw new APIError(res, {
        message: "Malformed JSON response from server",
      });
    }
  }

  if (!text) {
    throw new APIError(res, { message: "Empty error response from server" });
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    throw new APIError(res, {
      message: "Malformed error response from server",
    });
  }

  const errRes = newAPIErrorResponse(payload);
  throw new APIError(res, errRes);
};
