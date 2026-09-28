import z from "zod";
import { formCodes } from "../errorCodes";
import {
    type FormFieldError,
    formFieldDiscriminatedUnionSchema,
} from "./formField";

/**
 * Represents a node in the nested form validation error hierarchy.
 */
export type FieldNode =
    | {
          key: string;
          errors: FormFieldError[];
      }
    | {
          key: string;
          children: FieldNode[];
      };

const fieldNodeSchema: z.ZodType<FieldNode> = z.lazy(() =>
    z.union([
        z.object({
            key: z.string(),
            errors: z.array(formFieldDiscriminatedUnionSchema),
        }),
        z.object({
            key: z.string(),
            children: z.array(fieldNodeSchema),
        }),
    ])
);

/**
 * Validates the hierarchical payload returned when form validation fails.
 */
export const formValidationFailedSchema = z.object({
    code: z.literal(formCodes.formValidationFailed),
    details: z.array(fieldNodeSchema),
});

/**
 * Inferred type representing a form validation error payload.
 */
export type FormValidationFailed = z.infer<typeof formValidationFailedSchema>;
