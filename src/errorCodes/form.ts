export const formCodes = {
    formValidationFailed: "validation-failed",
    formFieldInvalidTypeCauses: {
        invalidValue: "invalid-value",
        invalidEnumValue: "invalid-enum-value",
        requireHttps: "require-https",
        missingHost: "missing-host",
        containsPath: "contains-path",
        containsQuery: "contains-query",
        containsFragment: "contains-fragment",
        absoluteUrl: "absolute-url",
        nilId: "nil-id",
        invalidEmail: "invalid-email",
        missingMxRecords: "missing-mx-records",
        notDigit: "not-digit",
        notBase64UrlEncoded: "not-base64-url-encoded",
        invalidUrl: "invalid-url",
        nullValue: "null-value",
    },
} as const;

export const formFieldTypes = {
    missing: "missing",
    overflow: "overflow",
    underflow: "underflow",
    length: "length",
    invalid: "invalid",
    unknown: "unknown",
} as const;

export const formFieldInvalidTypeCauses = {
    invalidValue: "invalid-value",
    invalidEnumValue: "invalid-enum-value",
    requireHttps: "require-https",
    missingHost: "missing-host",
    containsPath: "contains-path",
    containsQuery: "contains-query",
    containsFragment: "contains-fragment",
    absoluteUrl: "absolute-url",
    nilID: "nil-id",
    invalidEmail: "invalid-email",
    missingMxRecords: "missing-mx-records",
    notDigit: "not-digit",
    notBase64UrlEncoded: "not-base64-url-encoded",
    invalidUrl: "invalid-url",
    nullValue: "null-value",
} as const;
