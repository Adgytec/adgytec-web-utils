import type z from "zod";
import { type ErrorDetails, errorSchema } from "../errorSchema";
import { BaseError } from "./baseError";

export class ApplicationError extends BaseError {
    #code: string;
    #details: unknown;

    constructor(code: string, details: object = {}) {
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

    parse(): ErrorDetails | z.ZodError {
        const { success, error, data } = errorSchema.safeParse(this.#details);
        if (!success) {
            return error;
        }
        return data;
    }
}
