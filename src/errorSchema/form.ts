import z from "zod";
import { FORM_VALIDATION_FAILED } from "../errorCodes";
import { formFieldDiscriminatedUnionSchema } from "./formField";

type FormFieldError = z.infer<typeof formFieldDiscriminatedUnionSchema>;

type FieldNode =
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
    code: z.literal(FORM_VALIDATION_FAILED),
    details: z.array(fieldNodeSchema),
});
