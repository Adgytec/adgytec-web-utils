import type * as z from "zod";
import type { FlattenedErrors } from "./flatten";

function flattenZodError(error: z.ZodError): FlattenedErrors {
    const errors: FlattenedErrors = {};

    for (const issue of error.issues) {
        const path = issue.path.join(".");

        if (!(path in errors)) {
            errors[path] = [];
        }
        const fieldErrors = errors[path];

        switch (issue.code) {
            case "too_small":
                if (issue.origin === "date") {
                    fieldErrors.push({
                        ...issue,
                        origin: "date",
                        code: "date_too_small",
                        minimum: new Date(Number(issue.minimum)),
                    });
                } else if (issue.origin === "string") {
                    fieldErrors.push({
                        ...issue,
                        origin: "string",
                        code: "string_too_short",
                    });
                } else {
                    fieldErrors.push(issue);
                }
                break;

            case "too_big":
                if (issue.origin === "date") {
                    fieldErrors.push({
                        ...issue,
                        origin: "date",
                        code: "date_too_big",
                        maximum: new Date(Number(issue.maximum)),
                    });
                } else if (issue.origin === "string") {
                    fieldErrors.push({
                        ...issue,
                        origin: "string",
                        code: "string_too_long",
                    });
                } else {
                    fieldErrors.push(issue);
                }
                break;

            default:
                fieldErrors.push(issue);
        }
    }

    return errors;
}

interface FormValidateSuccessResult<T> {
    success: true;
    data: T;
}

interface FormValidateFailureResult {
    success: false;
    errors: FlattenedErrors;
}

type FormValidateResult<T> =
    | FormValidateSuccessResult<T>
    | FormValidateFailureResult;

export type ValidateAndGetFormValues = <T extends z.ZodTypeAny>(
    formElement: HTMLFormElement,
    schema: T
) => FormValidateResult<z.infer<T>>;

export const validateAndGetFormValues: ValidateAndGetFormValues = (
    formElement,
    schema
) => {
    const valueObject = Object.fromEntries(new FormData(formElement));
    const result = schema.safeParse(valueObject);
    if (result.success) {
        return {
            success: true,
            data: result.data,
        };
    }

    return {
        success: false,
        errors: flattenZodError(result.error),
    };
};
