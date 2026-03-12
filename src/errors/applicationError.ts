import { BaseError } from "./baseError";

export class ApplicationError extends BaseError {
    #code: string;
    #details: unknown;

    constructor(code: string, details: unknown) {
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
}
