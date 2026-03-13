import z from "zod";
import {
    FIELD_MISSING,
    FIELD_OVERFLOW,
    FIELD_UNDERFLOW,
    INVALID_LENGTH,
    UNKNOWN_VALIDATION_ERROR,
    INVALID,
} from "../errorCodes";
import { defaultSchemas } from "./formFieldInvalid";

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
        max: details.max,
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
        min: details.min,
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
        min: details.min,
        max: details.max,
    }));

export function newFieldInvalidSchema(
    schemas: z.ZodObject<{ cause: z.ZodLiteral<string> }>[]
): z.ZodTypeAny {
    const detailsUnion = z.discriminatedUnion("cause", [
        ...defaultSchemas,
        ...schemas,
    ] as [z.ZodObject<any>, ...z.ZodObject<any>[]]);

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
