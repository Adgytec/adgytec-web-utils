import type { FieldNode, FormFieldError } from "../errorSchema";
import type { ZodIssue } from "./zod";

/**
 * A flat map of dotted form field paths to their corresponding validation errors.
 */
export type FlattenedErrors = Record<string, (FormFieldError | ZodIssue)[]>;

/**
 * Recursively flattens a nested hierarchy of form field error nodes into a flat record
 * of dotted key paths (e.g. `user.profile.age`).
 *
 * @param nodes - Array of hierarchical FieldNode error structures.
 * @param parentKey - Base path for recursion (used internally).
 * @returns Flattened error dictionary keyed by dotted field path.
 */
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
