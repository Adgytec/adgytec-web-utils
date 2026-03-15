import z from "zod";
import {
    FIELD_MISSING,
    FIELD_OVERFLOW,
    FIELD_UNDERFLOW,
    INVALID_LENGTH,
    UNKNOWN_VALIDATION_ERROR,
    INVALID,
} from "../errorCodes";
import { formFieldInvalidDiscriminatedUnion } from "./formFieldInvalid";

export const fieldUnknownValidationErrorSchema = z.object({
    type: z.literal(UNKNOWN_VALIDATION_ERROR),
});

export const fieldMissingErrorSchema = z.object({
    type: z.literal(FIELD_MISSING),
});

export const fieldOverflowErrorSchema = z.object({
    type: z.literal(FIELD_OVERFLOW),
    details: z.object({
        max: z.union([z.coerce.date(), z.number()]),
    }),
});

export const fieldUnderflowErrorSchema = z.object({
    type: z.literal(FIELD_UNDERFLOW),
    details: z.object({
        min: z.union([z.coerce.date(), z.number()]),
    }),
});

export const fieldLengthErrorSchema = z.object({
    type: z.literal(INVALID_LENGTH),
    details: z.object({
        min: z.number(),
        max: z.number(),
    }),
});

export const fieldInvalidSchema = z.object({
    type: z.literal(INVALID),
    details: formFieldInvalidDiscriminatedUnion,
});

export const formFieldDiscriminatedUnionSchema = z.discriminatedUnion("type", [
    fieldUnknownValidationErrorSchema,
    fieldMissingErrorSchema,
    fieldOverflowErrorSchema,
    fieldUnderflowErrorSchema,
    fieldLengthErrorSchema,
    fieldInvalidSchema,
]);
