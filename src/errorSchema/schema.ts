import z from "zod";
import { defaultAuthSchemas } from "./auth";
import { defaultCommonSchemas } from "./common";
import { newFormValidationFailedSchema } from "./form";
import { defaultIamSchemas } from "./iam";
import { defaultMediaSchemas } from "./media";
import { defaultPaginationSchemas } from "./pagination";
import { defaultRequestBodySchemas } from "./reqBody";
import { defaultServerSchemas } from "./server";
import type { ErrorSchemaType, NewErrorSchema, NonEmptyArray } from "./types";

export function newErrorSchema({
    errorSchemas,
    invalidFieldSchemas,
}: NewErrorSchema) {
    const formErrorSchema = newFormValidationFailedSchema(invalidFieldSchemas);
    const schemas: ErrorSchemaType[] = [
        ...defaultAuthSchemas,
        ...defaultCommonSchemas,
        ...defaultIamSchemas,
        ...defaultMediaSchemas,
        ...defaultPaginationSchemas,
        ...defaultRequestBodySchemas,
        ...defaultServerSchemas,
        formErrorSchema,
    ];
    if (errorSchemas) schemas.push(...errorSchemas);

    return z.discriminatedUnion(
        "code",
        schemas as NonEmptyArray<ErrorSchemaType>
    );
}
