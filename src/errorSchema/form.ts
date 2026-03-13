import z from "zod";
import { FORM_VALIDATION_FAILED } from "../errorCodes";

export const errorFieldDetails = z.object({
    type: z.string(),
});

export interface ErrorField {
    key: string;
    errors?: string;
}

export const formValidationFailedSchema = z.object({
    code: z.literal(FORM_VALIDATION_FAILED),
});
