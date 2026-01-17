import { APIError } from "./apiError";
import { BaseError } from "./baseError";
import type { ParseError } from "./types";

const defaultRetryAfter = 1000; // in ms

export const parseError: ParseError = (error) => {
  // Check for network-level errors.
  if (
    error instanceof TypeError &&
    (error.message === "Failed to fetch" ||
      error.message === "NetworkError when attempting to fetch resource." ||
      error.message === "Load failed" || // Safari
      error.message.includes("NetworkError") ||
      error.message.includes("fetch"))
  ) {
    return {
      errorCode: "network-error",
      message: "Check your network connection or try again later.",
    };
  }

  if (error instanceof APIError) {
    // server error
    if (error.response.status >= 500) {
      return {
        errorCode: "server-error",
        message:
          error.data?.message ??
          "Internal server error. Please try again later.",
      };
    }

    switch (error.response.status) {
      case 422:
        return {
          errorCode: "form-field-error",
          fieldErrors: error.data.fieldErrors ?? {},
        };

      case 400:
        return {
          errorCode: "user-action-error",
          message:
            error.data?.message ??
            "Something went wrong while processing your request.",
        };

      case 401:
        return {
          errorCode: "authentication-error",
          message: error.data?.message ?? "User login required.",
        };

      case 403:
        return {
          errorCode: "authorization-error",
          message:
            error.data?.message ??
            "You don't have necessary permissions to perform the requested action.",
        };

      case 404:
        return {
          errorCode: "not-found-error",
          message: error.data?.message ?? "Requested action not found.",
        };

      case 405:
        return {
          errorCode: "method-not-allowed-error",
          message:
            error.data?.message ?? "Requested action method not allowed.",
        };

      case 429:
        const retryAfterHeader = error.response.headers.get("retry-after");
        let retryAfterMs = defaultRetryAfter;

        if (retryAfterHeader) {
          const parsedSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsedSeconds)) {
            retryAfterMs = parsedSeconds * 1000;
          } else {
            const date = new Date(retryAfterHeader);
            if (!isNaN(date.getTime())) {
              retryAfterMs = Math.max(0, date.getTime() - Date.now());
            }
          }
        }

        return {
          errorCode: "too-many-requests-error",
          retryAfter: retryAfterMs,
          message: "Too many requests. Try again later.",
        };

      case 413:
        return {
          errorCode: "content-too-large-error",
          message: error.data?.message ?? "Request content too large.",
        };

      default:
        return {
          errorCode: "unknown-error",
          message: error.data?.message ?? `Unexpected error occurred.`,
        };
    }
  }

  if (error instanceof BaseError) {
    return {
      errorCode: "unknown-error",
      message: error.message,
    };
  }

  return {
    errorCode: "unknown-error",
    message:
      "Unknown error occurred. Please refresh this page or try again later.",
  };
};
