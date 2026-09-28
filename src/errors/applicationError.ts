import type z from "zod";
import { type ErrorDetails, errorSchema } from "../errorSchema";
import { BaseError } from "./baseError";

/**
 * Structured application error encapsulating an error code and arbitrary details payload,
 * matching server-side API error payload design.
 */
export class ApplicationError extends BaseError {
    #code: string;
    #details: unknown;

    /**
     * Creates a new ApplicationError.
     *
     * @param code - The string error code identifying the failure.
     * @param details - Additional structured metadata associated with the error.
     */
    constructor(code: string, details: object = {}) {
        super("application-error");

        this.#code = code;
        this.#details = {
            ...details,
            code,
        };
    }

    /**
     * Raw details payload containing the error code and associated metadata.
     */
    get details() {
        return this.#details;
    }

    /**
     * String error code identifying this error.
     */
    get code() {
        return this.#code;
    }

    /**
     * Validates the error details against the root `errorSchema`.
     *
     * @returns The parsed `ErrorDetails` object if valid, or a `ZodError` if validation fails.
     */
    parse(): ErrorDetails | z.ZodError {
        const { success, error, data } = errorSchema.safeParse(this.#details);
        if (!success) {
            return error;
        }
        return data;
    }
}
