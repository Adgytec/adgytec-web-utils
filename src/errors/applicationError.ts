import { errorSchema, type ErrorCode, type ErrorDetails } from "../errorSchema";
import { BaseError } from "./baseError";

export class ApplicationError extends BaseError {
    #code: ErrorCode;
    #details: unknown;

    constructor(code: ErrorCode, details: unknown) {
        super("application-error");

        this.#code = code;
        this.#details = details;
    }

    get details() {
        return this.#details;
    }

    get code() {
        return this.#code;
    }

    parse(): ErrorDetails {
        const { success, data, error } = errorSchema.safeParse(this.#details);
        if (!success) {
            throw error;
        }
        return data;
    }
}
