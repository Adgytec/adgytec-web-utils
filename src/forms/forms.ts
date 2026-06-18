import type * as z from "zod";
import { formFieldInvalidTypeCauses, formFieldTypes } from "../errorCodes";
import type { FormFieldError } from "../errorSchema";
import type { FlattenedErrors } from "./flatten";

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

const ROOT_FIELD_KEY = "form";

const getNumericLimit = (limit: number | bigint) =>
    typeof limit === "bigint" ? Number(limit) : limit;

const getInvalidFormatCause = (
    format: string
): FormFieldError & { type: "invalid" } => {
    if (format === "email") {
        return {
            type: formFieldTypes.invalid,
            details: {
                cause: formFieldInvalidTypeCauses.invalidEmail,
            },
        };
    }

    if (format === "url") {
        return {
            type: formFieldTypes.invalid,
            details: {
                cause: formFieldInvalidTypeCauses.invalidUrl,
            },
        };
    }

    if (format === "base64url") {
        return {
            type: formFieldTypes.invalid,
            details: {
                cause: formFieldInvalidTypeCauses.notBase64UrlEncoded,
            },
        };
    }

    return {
        type: formFieldTypes.invalid,
        details: {
            cause: formFieldInvalidTypeCauses.invalidValue,
        },
    };
};

const getFormFieldError = (issue: z.core.$ZodIssue): FormFieldError => {
    switch (issue.code) {
        case "invalid_type":
            if (issue.input === undefined) {
                return {
                    type: formFieldTypes.missing,
                };
            }

            if (issue.input === null) {
                return {
                    type: formFieldTypes.invalid,
                    details: {
                        cause: formFieldInvalidTypeCauses.nullValue,
                    },
                };
            }

            return {
                type: formFieldTypes.invalid,
                details: {
                    cause: formFieldInvalidTypeCauses.invalidValue,
                },
            };

        case "too_big": {
            const maximum = getNumericLimit(issue.maximum);

            if (issue.exact) {
                return {
                    type: formFieldTypes.length,
                    details: {
                        min: maximum,
                        max: maximum,
                    },
                };
            }

            return {
                type: formFieldTypes.overflow,
                details: {
                    max: maximum,
                },
            };
        }

        case "too_small": {
            const minimum = getNumericLimit(issue.minimum);

            if (issue.exact) {
                return {
                    type: formFieldTypes.length,
                    details: {
                        min: minimum,
                        max: minimum,
                    },
                };
            }

            return {
                type: formFieldTypes.underflow,
                details: {
                    min: minimum,
                },
            };
        }

        case "invalid_format":
            return getInvalidFormatCause(issue.format);

        case "invalid_value":
            return {
                type: formFieldTypes.invalid,
                details: {
                    cause: formFieldInvalidTypeCauses.invalidEnumValue,
                    possibleValues: issue.values.map((value) => String(value)),
                },
            };

        default:
            return {
                type: formFieldTypes.unknown,
            };
    }
};

const getFormValidationErrorMap = (error: z.ZodError): FlattenedErrors => {
    const errors: FlattenedErrors = {};

    for (const issue of error.issues) {
        const fieldError = getFormFieldError(issue);

        if (issue.code === "unrecognized_keys") {
            for (const key of issue.keys) {
                if (!errors[key]) {
                    errors[key] = [];
                }
                errors[key].push(fieldError);
            }
            continue;
        }

        const key = String(issue.path[0] ?? ROOT_FIELD_KEY);
        if (!errors[key]) {
            errors[key] = [];
        }
        errors[key].push(fieldError);
    }

    return errors;
};

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
        errors: getFormValidationErrorMap(result.error),
    };
};
