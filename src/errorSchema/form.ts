import z from "zod";
import { formCodes } from "../errorCodes";
import {
    type FormFieldError,
    formFieldDiscriminatedUnionSchema,
} from "./formField";

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

export const formValidationFailedSchema = z.object({
    code: z.literal(formCodes.formValidationFailed),
    details: z.array(fieldNodeSchema),
});

export type FormValidationFailed = z.infer<typeof formValidationFailedSchema>;
