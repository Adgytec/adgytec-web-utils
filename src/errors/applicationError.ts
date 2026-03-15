import { errorSchema, type ErrorCode, type ErrorDetails } from "../errorSchema";
import { BaseError } from "./baseError";

export class ApplicationError extends BaseError {
    #code: ErrorCode;
    #details: unknown;

    constructor(code: ErrorCode, details: object = {}) {
        super("application-error");

        this.#code = code;
        this.#details = {
            ...details,
            code,
        };
    }

    get details() {
        return this.#details;
    }

    get code() {
        return this.#code;
    }

    parse(): ErrorDetails {
        return errorSchema.parse(this.#details);
    }
}
