import type { z } from "zod";

export interface ZodIssueStringTooShort
    extends Omit<z.core.$ZodIssueTooSmall, "code" | "origin"> {
    readonly code: "string_too_short";
    readonly origin: "string";
}

export interface ZodIssueStringTooLong
    extends Omit<z.core.$ZodIssueTooBig, "code" | "origin"> {
    readonly code: "string_too_long";
    readonly origin: "string";
}

export interface ZodIssueDateTooSmall
    extends Omit<z.core.$ZodIssueTooSmall, "code" | "origin" | "minimum"> {
    readonly code: "date_too_small";
    readonly origin: "date";
    readonly minimum: Date;
}

export interface ZodIssueDateTooBig
    extends Omit<z.core.$ZodIssueTooBig, "code" | "origin" | "maximum"> {
    readonly code: "date_too_big";
    readonly origin: "date";
    readonly maximum: Date;
}

export type ZodIssue =
    | z.core.$ZodIssue
    | ZodIssueDateTooBig
    | ZodIssueDateTooSmall
    | ZodIssueStringTooLong
    | ZodIssueStringTooShort;
