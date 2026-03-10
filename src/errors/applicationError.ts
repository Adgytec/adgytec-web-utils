import { BaseError } from "./baseError";

export class ApplicationError extends BaseError {
    code: string;
    res: any;

    constructor(code: string, res: any) {
        super("application-error");

        this.code = code;
        this.res = res;
    }
}
