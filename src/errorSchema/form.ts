import z from "zod";
import { FORM_VALIDATION_FAILED } from "../errorCodes";
import { defaultFieldSchemas, newFieldInvalidSchema } from "./formField";
import type { InvalidSchemaType, NonEmptyArray } from "./types";

export function newFormValidationFailedSchema(
    schemas?: InvalidSchemaType[]
): z.ZodTypeAny {
    const fieldSchemas: z.ZodTypeAny[] = [
        ...defaultFieldSchemas,
        newFieldInvalidSchema(schemas),
    ];

    const errorDetailsSchema = z.discriminatedUnion(
        "type",
        fieldSchemas as NonEmptyArray<z.ZodObject<any>>
    );

    const fieldNodeSchema: z.ZodTypeAny = z.lazy(() =>
        z.union([
            z.object({
                key: z.string(),
                errors: z.array(errorDetailsSchema),
            }),
            z.object({
                key: z.string(),
                children: z.array(fieldNodeSchema),
            }),
        ])
    );

    return z.object({
        code: z.literal(FORM_VALIDATION_FAILED),
        details: fieldNodeSchema,
    });
}
