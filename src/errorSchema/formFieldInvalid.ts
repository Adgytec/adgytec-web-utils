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

export const InvalidValueErrorSchema = z.object({
    cause: z.literal(INVALID_VALUE),
});

export const InvalidEnumValueErrorSchema = z.object({
    cause: z.literal(INVALID_ENUM_VALUE),
    possibleValues: z.array(z.string()),
});

export const RequireHttpsErrorSchema = z.object({
    cause: z.literal(REQUIRE_HTTPS),
});

export const MissingHostErrorSchema = z.object({
    cause: z.literal(MISSING_HOST),
});

export const ContainsPathErrorSchema = z.object({
    cause: z.literal(CONTAINS_PATH),
});

export const ContainsQueryErrorSchema = z.object({
    cause: z.literal(CONTAINS_QUERY),
});

export const ContainsFragmentErrorSchema = z.object({
    cause: z.literal(CONTAINS_FRAGMENT),
});

export const AbsoluteUrlErrorSchema = z.object({
    cause: z.literal(ABSOLUTE_URL),
});

export const NilIdErrorSchema = z.object({
    cause: z.literal(NIL_ID),
});

export const InvalidEmailErrorSchema = z.object({
    cause: z.literal(INVALID_EMAIL),
});

export const MissingMxRecordsErrorSchema = z.object({
    cause: z.literal(MISSING_MX_RECORDS),
});

export const NotDigitErrorSchema = z.object({
    cause: z.literal(NOT_DIGIT),
});

export const NotBase64UrlEncodedErrorSchema = z.object({
    cause: z.literal(NOT_BASE64_URL_ENCODED),
});

export const InvalidUrlErrorSchema = z.object({
    cause: z.literal(INVALID_URL),
});

export const NullValueErrorSchema = z.object({
    cause: z.literal(NULL_VALUE),
});
