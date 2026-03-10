import { BaseError } from "./baseError";

export class ApplicationError extends BaseError {
    code: string;
    res: unknown;

    constructor(code: string, res: unknown) {
        super("application-error");

        this.code = code;
        this.res = res;
    }
}
