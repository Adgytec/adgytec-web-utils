import z from "zod";
import { formFieldTypes } from "../errorCodes";
import { formFieldInvalidDiscriminatedUnion } from "./formFieldInvalid";

export const fieldUnknownValidationErrorSchema = z.object({
    type: z.literal(formFieldTypes.unknown),
});

export const fieldMissingErrorSchema = z.object({
    type: z.literal(formFieldTypes.missing),
});

export const fieldOverflowErrorSchema = z.object({
    type: z.literal(formFieldTypes.overflow),
    details: z.object({
        max: z.union([z.coerce.date(), z.number()]),
    }),
});

export const fieldUnderflowErrorSchema = z.object({
    type: z.literal(formFieldTypes.underflow),
    details: z.object({
        min: z.union([z.coerce.date(), z.number()]),
    }),
});

export const fieldLengthErrorSchema = z.object({
    type: z.literal(formFieldTypes.length),
    details: z.object({
        min: z.number(),
        max: z.number(),
    }),
});

export const fieldInvalidSchema = z.object({
    type: z.literal(formFieldTypes.invalid),
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

export type FormFieldError = z.infer<typeof formFieldDiscriminatedUnionSchema>;
