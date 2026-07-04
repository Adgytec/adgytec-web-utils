import type { FieldNode, FormFieldError } from "../errorSchema";
import type { ZodIssue } from "./zod";

export type FlattenedErrors = Record<string, (FormFieldError | ZodIssue)[]>;

export function flattenFieldNodes(
    nodes: FieldNode[],
    parentKey = ""
): FlattenedErrors {
    const result: FlattenedErrors = {};

    for (const node of nodes) {
        const currentKey = parentKey ? `${parentKey}.${node.key}` : node.key;

        if ("errors" in node) {
            result[currentKey] = node.errors;
        } else {
            Object.assign(result, flattenFieldNodes(node.children, currentKey));
        }
    }

    return result;
}
