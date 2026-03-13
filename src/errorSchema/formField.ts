import z from "zod";
import {
    FIELD_MISSING,
    FIELD_OVERFLOW,
    FIELD_UNDERFLOW,
    INVALID_LENGTH,
    UNKNOWN_VALIDATION_ERROR,
    INVALID,
} from "../errorCodes";
import { defaultInvalidFieldSchemas } from "./formFieldInvalid";
import type { InvalidSchemaType, NonEmptyArray } from "./types";

export const fieldUnknownValidationErrorSchema = z.object({
    type: z.literal(UNKNOWN_VALIDATION_ERROR),
});

export const fieldMissingErrorSchema = z.object({
    type: z.literal(FIELD_MISSING),
});

export const fieldOverflowErrorSchema = z
    .object({
        type: z.literal(FIELD_OVERFLOW),
        details: z.object({
            max: z.union([z.date(), z.number()]),
        }),
    })
    .transform(({ type, details }) => ({
        type,
        ...details,
    }));

export const fieldUnderflowErrorSchema = z
    .object({
        type: z.literal(FIELD_UNDERFLOW),
        details: z.object({
            min: z.union([z.date(), z.number()]),
        }),
    })
    .transform(({ type, details }) => ({
        type,
        ...details,
    }));

export const fieldLengthErrorSchema = z
    .object({
        type: z.literal(INVALID_LENGTH),
        details: z.object({
            min: z.number(),
            max: z.number(),
        }),
    })
    .transform(({ type, details }) => ({
        type,
        ...details,
    }));

export function newFieldInvalidSchema(
    schemas?: InvalidSchemaType[]
): z.ZodTypeAny {
    const invalidFieldSchemas: z.ZodTypeAny[] = [...defaultInvalidFieldSchemas];
    if (schemas) invalidFieldSchemas.push(...schemas);

    const detailsUnion = z.discriminatedUnion(
        "cause",
        invalidFieldSchemas as NonEmptyArray<z.ZodObject<any>>
    );

    return z
        .object({
            type: z.literal(INVALID),
            details: detailsUnion,
        })
        .transform(({ type, details }) => ({
            type,
            ...details,
        }));
}

export const defaultFieldSchemas = [
    fieldUnknownValidationErrorSchema,
    fieldMissingErrorSchema,
    fieldOverflowErrorSchema,
    fieldUnderflowErrorSchema,
    fieldLengthErrorSchema,
];
