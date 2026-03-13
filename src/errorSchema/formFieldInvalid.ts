import z from "zod";
import {
    INVALID_ENUM_VALUE,
    INVALID_VALUE,
    REQUIRE_HTTPS,
    MISSING_HOST,
    CONTAINS_PATH,
    CONTAINS_QUERY,
    CONTAINS_FRAGMENT,
    ABSOLUTE_URL,
    NIL_ID,
    INVALID_EMAIL,
    MISSING_MX_RECORDS,
    NOT_DIGIT,
    NOT_BASE64_URL_ENCODED,
    INVALID_URL,
    NULL_VALUE,
} from "../errorCodes";

export const invalidValueErrorSchema = z.object({
    cause: z.literal(INVALID_VALUE),
});

export const invalidEnumValueErrorSchema = z.object({
    cause: z.literal(INVALID_ENUM_VALUE),
    possibleValues: z.array(z.string()),
});

export const requireHttpsErrorSchema = z.object({
    cause: z.literal(REQUIRE_HTTPS),
});

export const missingHostErrorSchema = z.object({
    cause: z.literal(MISSING_HOST),
});

export const containsPathErrorSchema = z.object({
    cause: z.literal(CONTAINS_PATH),
});

export const containsQueryErrorSchema = z.object({
    cause: z.literal(CONTAINS_QUERY),
});

export const containsFragmentErrorSchema = z.object({
    cause: z.literal(CONTAINS_FRAGMENT),
});

export const absoluteUrlErrorSchema = z.object({
    cause: z.literal(ABSOLUTE_URL),
});

export const nilIdErrorSchema = z.object({
    cause: z.literal(NIL_ID),
});

export const invalidEmailErrorSchema = z.object({
    cause: z.literal(INVALID_EMAIL),
});

export const missingMxRecordsErrorSchema = z.object({
    cause: z.literal(MISSING_MX_RECORDS),
});

export const notDigitErrorSchema = z.object({
    cause: z.literal(NOT_DIGIT),
});

export const notBase64UrlEncodedErrorSchema = z.object({
    cause: z.literal(NOT_BASE64_URL_ENCODED),
});

export const invalidUrlErrorSchema = z.object({
    cause: z.literal(INVALID_URL),
});

export const nullValueErrorSchema = z.object({
    cause: z.literal(NULL_VALUE),
});

export const defaultInvalidFieldSchemas = [
    invalidValueErrorSchema,
    invalidEnumValueErrorSchema,
    requireHttpsErrorSchema,
    missingHostErrorSchema,
    containsPathErrorSchema,
    containsQueryErrorSchema,
    containsFragmentErrorSchema,
    absoluteUrlErrorSchema,
    nilIdErrorSchema,
    invalidEmailErrorSchema,
    missingMxRecordsErrorSchema,
    notDigitErrorSchema,
    notBase64UrlEncodedErrorSchema,
    invalidUrlErrorSchema,
    nullValueErrorSchema,
];
