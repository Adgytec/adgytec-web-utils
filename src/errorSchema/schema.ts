import z from "zod";
import type { DefaultOverridesCode } from "../errorCodes";
import { invalidJWTSchema, invalidSignedUrlSchema } from "./auth";
import { limitReachedSchema } from "./constraints";
import { formValidationFailedSchema } from "./form";
import { duplicateMediaIDSchema, mediaTooLargeSchema } from "./media";
import {
    actorForbiddenSchema,
    actorNotInWorkspaceSchema,
    invalidAuthHeaderSchema,
    moduleNotInWorkspaceSchema,
    unsupportedAuthSchemeSchema,
    workspaceForbiddenSchema,
} from "./middleware";
import {
    internalServerErrorSchema,
    invalidResponseShapeSchema,
    malformedJSONFromServerSchema,
    malformedResponseBodySchema,
    methodNotAllowedSchema,
    networkErrorSchema,
    routeNotFoundSchema,
    unexpectedErrorSchema,
    unknownServerErrorSchema,
    zodErrorSchema,
} from "./misc";
import {
    emptyRequestBodySchema,
    invalidRequestBodySchema,
    requestBodyTooLargeSchema,
    unknownFieldInRequestBodySchema,
} from "./payload";
import { permissionDeniedSchema, workspaceNotFoundSchema } from "./permissions";
import { invalidIDSchema } from "./reqParams";

/**
 * Comprehensive discriminated union of all supported application error schemas.
 */
export const errorSchema = z.discriminatedUnion("code", [
    invalidSignedUrlSchema,
    invalidJWTSchema,

    invalidIDSchema,

    formValidationFailedSchema,

    permissionDeniedSchema,
    workspaceNotFoundSchema,

    limitReachedSchema,

    mediaTooLargeSchema,
    duplicateMediaIDSchema,

    workspaceForbiddenSchema,
    actorForbiddenSchema,
    actorNotInWorkspaceSchema,
    unsupportedAuthSchemeSchema,
    invalidAuthHeaderSchema,
    moduleNotInWorkspaceSchema,

    routeNotFoundSchema,
    methodNotAllowedSchema,
    networkErrorSchema,
    unexpectedErrorSchema,
    zodErrorSchema,
    malformedResponseBodySchema,
    malformedJSONFromServerSchema,
    invalidResponseShapeSchema,
    unknownServerErrorSchema,
    internalServerErrorSchema,

    invalidRequestBodySchema,
    unknownFieldInRequestBodySchema,
    requestBodyTooLargeSchema,
    emptyRequestBodySchema,
]);

/**
 * Union type of all valid error code strings.
 */
export type ErrorCode = z.infer<typeof errorSchema>["code"];

/**
 * Union type of all validated error payload shapes.
 */
export type ErrorDetails = z.infer<typeof errorSchema>;

/**
 * Error payload shapes after default overrides are mapped/collapsed to `unexpected-error`.
 */
export type ErrorDetailsNormalized = Exclude<
    ErrorDetails,
    {
        code: DefaultOverridesCode;
    }
>;
