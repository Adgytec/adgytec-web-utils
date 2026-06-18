import type * as z from "zod";
import { formFieldInvalidTypeCauses, formFieldTypes } from "../errorCodes";
import type { FieldNode, FormFieldError } from "../errorSchema";
import type { FlattenedErrors } from "./flatten";
import { flattenFieldNodes } from "./flatten";

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

const getIssuePath = (issue: z.core.$ZodIssue) =>
    issue.path.map((pathSegment) => String(pathSegment));

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

const pushFieldError = (
    fieldNodes: FieldNode[],
    path: string[],
    error: FormFieldError
) => {
    const [key = ROOT_FIELD_KEY, ...childrenPath] = path;
    const existingNode = fieldNodes.find((fieldNode) => fieldNode.key === key);

    if (childrenPath.length === 0) {
        if (existingNode && "errors" in existingNode) {
            existingNode.errors.push(error);
            return;
        }

        fieldNodes.push({
            key,
            errors: [error],
        });
        return;
    }

    if (existingNode && "children" in existingNode) {
        pushFieldError(existingNode.children, childrenPath, error);
        return;
    }

    const children: FieldNode[] = [];
    fieldNodes.push({
        key,
        children,
    });
    pushFieldError(children, childrenPath, error);
};

const getFormValidationFailed = (error: z.ZodError): FieldNode[] => {
    const details: FieldNode[] = [];

    for (const issue of error.issues) {
        if (issue.code === "unrecognized_keys") {
            const parentPath = getIssuePath(issue);

            for (const key of issue.keys) {
                pushFieldError(
                    details,
                    [...parentPath, key],
                    getFormFieldError(issue)
                );
            }

            continue;
        }

        pushFieldError(details, getIssuePath(issue), getFormFieldError(issue));
    }

    return details;
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
        errors: flattenFieldNodes(getFormValidationFailed(result.error)),
    };
};
