import z from "zod";
import { ApplicationError } from "../errors";

export function parseError<T extends z.ZodTypeAny>(
    err: unknown,
    schema: T
): z.infer<T> | null {
    if (!(err instanceof ApplicationError)) {
        return null;
    }

    const details = schema.safeParse(err.details);
    return details.success ? details.data : null;
}
