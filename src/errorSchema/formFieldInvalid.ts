import z from "zod";
import { formFieldInvalidTypeCauses } from "../errorCodes";

export const invalidValueErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.invalidValue),
});

export const invalidEnumValueErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.invalidEnumValue),
    possibleValues: z.array(z.string()),
});

export const requireHttpsErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.requireHttps),
});

export const missingHostErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.missingHost),
});

export const containsPathErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.containsPath),
});

export const containsQueryErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.containsQuery),
});

export const containsFragmentErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.containsFragment),
});

export const absoluteUrlErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.absoluteUrl),
});

export const nilIDErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.nilID),
});

export const invalidEmailErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.invalidEmail),
});

export const missingMxRecordsErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.missingMxRecords),
});

export const notDigitErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.notDigit),
});

export const notBase64UrlEncodedErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.notBase64UrlEncoded),
});

export const invalidUrlErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.invalidUrl),
});

export const nullValueErrorSchema = z.object({
    cause: z.literal(formFieldInvalidTypeCauses.nullValue),
});

export const formFieldInvalidDiscriminatedUnion = z.discriminatedUnion(
    "cause",
    [
        invalidValueErrorSchema,
        invalidEnumValueErrorSchema,
        requireHttpsErrorSchema,
        missingHostErrorSchema,
        containsPathErrorSchema,
        containsQueryErrorSchema,
        containsFragmentErrorSchema,
        absoluteUrlErrorSchema,
        nilIDErrorSchema,
        invalidEmailErrorSchema,
        missingMxRecordsErrorSchema,
        notDigitErrorSchema,
        notBase64UrlEncodedErrorSchema,
        invalidUrlErrorSchema,
        nullValueErrorSchema,
    ]
);
