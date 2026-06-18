import z from "zod";
import type { DefaultOverrideCode } from "../errorCodes";
import {
    authErrorSchema,
    hashMismatchSchema,
    invalidApiKeySchema,
    invalidAuthHeaderValueSchema,
    invalidSignedUrlSchema,
    jwtNotAcceptableSchema,
    organizationStatusBadSchema,
    tokenNotFoundSchema,
    unsupportedAuthSchemeSchema,
    userDisabledSchema,
    userNotExistInOrganizationSchema,
    userNotExistsInOrganizationManagementSchema,
    userNotFoundSchema,
} from "./auth";
import {
    invalidIDSchema,
    methodNotAllowedSchema,
    networkErrorSchema,
    routeNotFoundSchema,
    unexpectedErrorSchema,
    zodErrorSchema,
} from "./common";
import { formValidationFailedSchema } from "./form";
import {
    authorizationErrorSchema,
    invalidActorSchema,
    missingPermissionSchema,
    permissionExplicitlyDeniedSchema,
    selfPermissionMismatchSchema,
} from "./iam";
import {
    completeMultipartUploadCalledTooSoonSchema,
    invalidMultipartNumberSchema,
    mediaItemsLimitExceededSchema,
    mediaObjectNotFoundSchema,
    mediaTooLargeSchema,
    mediaUploadErrorSchema,
    missingETagValueSchema,
    multipartPartUploadFailedSchema,
    singlepartUploadFailedSchema,
    unsupportedObjectUploadedSchema,
    uploadAlreadyCompletedSchema,
} from "./media";
import { invalidCursorValueSchema } from "./pagination";
import {
    emptyRequestBodySchema,
    invalidRequestBodySchema,
    requestBodyTooLargeSchema,
    unknownFieldInRequestBodySchema,
} from "./reqBody";
import { limitExceededSchema } from "./restrictions";
import {
    internalServerErrorSchema,
    invalidResponseShapeSchema,
    malformedJSONFromServerSchema,
    malformedResponseBodySchema,
    unknownServerErrorSchema,
} from "./server";

export const errorSchema = z.discriminatedUnion("code", [
    authErrorSchema,
    invalidApiKeySchema,
    userNotFoundSchema,
    jwtNotAcceptableSchema,
    invalidSignedUrlSchema,
    hashMismatchSchema,
    invalidAuthHeaderValueSchema,
    organizationStatusBadSchema,
    userNotExistsInOrganizationManagementSchema,
    userNotExistInOrganizationSchema,
    userDisabledSchema,
    tokenNotFoundSchema,
    unsupportedAuthSchemeSchema,

    invalidIDSchema,
    routeNotFoundSchema,
    methodNotAllowedSchema,
    networkErrorSchema,
    unexpectedErrorSchema,
    zodErrorSchema,

    formValidationFailedSchema,

    authorizationErrorSchema,
    selfPermissionMismatchSchema,
    invalidActorSchema,
    permissionExplicitlyDeniedSchema,
    missingPermissionSchema,

    limitExceededSchema,

    mediaUploadErrorSchema,
    invalidMultipartNumberSchema,
    mediaObjectNotFoundSchema,
    mediaTooLargeSchema,
    mediaItemsLimitExceededSchema,
    uploadAlreadyCompletedSchema,
    unsupportedObjectUploadedSchema,
    completeMultipartUploadCalledTooSoonSchema,
    singlepartUploadFailedSchema,
    multipartPartUploadFailedSchema,
    missingETagValueSchema,

    invalidCursorValueSchema,

    invalidRequestBodySchema,
    unknownFieldInRequestBodySchema,
    requestBodyTooLargeSchema,
    emptyRequestBodySchema,

    malformedResponseBodySchema,
    malformedJSONFromServerSchema,
    invalidResponseShapeSchema,
    unknownServerErrorSchema,
    internalServerErrorSchema,
]);

export type ErrorCode = z.infer<typeof errorSchema>["code"];
export type ErrorDetails = z.infer<typeof errorSchema>;

export type ErrorDetailsNormalized = Exclude<
    ErrorDetails,
    {
        code: DefaultOverrideCode;
    }
>;
export type NormalizedErrorCode = ErrorDetailsNormalized["code"];
