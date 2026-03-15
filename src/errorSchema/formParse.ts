import type { FieldNode } from "./form";
import type { FormFieldError } from "./formField";

export type FlattenedErrors = Record<string, FormFieldError[]>;

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
