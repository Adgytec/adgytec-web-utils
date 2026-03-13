import z from "zod";
import { FORM_VALIDATION_FAILED } from "../errorCodes";

export interface ErrorField {
    key: string;
    errors?: string;
}

export const formValidationFailedSchema = z.object({
    code: z.literal(FORM_VALIDATION_FAILED),
});
