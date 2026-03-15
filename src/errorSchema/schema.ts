import z from "zod";
import {
    hashMismatchSchema,
    invalidApiKeySchema,
    invalidAuthHeaderValueSchema,
    invalidSignedUrlSchema,
    jwtNotAcceptableSchema,
    organizationStatusBadSchema,
    tokenNotFoundSchema,
    userDisabledSchema,
    userNotExistInOrganizationSchema,
    userNotExistsInOrganizationManagementSchema,
    userNotFoundSchema,
} from "./auth";
import {
    completeMultipartUploadCalledTooSoonSchema,
    invalidMultipartNumberSchema,
    mediaItemsLimitExceededSchema,
    mediaObjectNotFoundSchema,
    mediaTooLargeSchema,
    unsupportedObjectUploadedSchema,
    uploadAlreadyCompletedSchema,
} from "./media";
import { invalidIDSchema } from "./common";
import { formValidationFailedSchema } from "./form";
import {
    invalidActorSchema,
    missingPermissionSchema,
    permissionExplicitlyDeniedSchema,
    selfPermissionMismatchSchema,
} from "./iam";
import { invalidCursorValueSchema } from "./pagination";
import {
    emptyRequestBodySchema,
    invalidRequestBodySchema,
    requestBodyTooLargeSchema,
    unknownFieldInRequestBodySchema,
} from "./reqBody";
import {
    invalidResponseShapeSchema,
    malformedJSONFromServerSchema,
    unknownServerErrorSchema,
} from "./server";

export const errorSchema = z.discriminatedUnion("code", [
    invalidApiKeySchema,
    userNotFoundSchema,
    jwtNotAcceptableSchema,
    invalidSignedUrlSchema,
    hashMismatchSchema,
    invalidAuthHeaderValueSchema,
    unsupportedObjectUploadedSchema,
    organizationStatusBadSchema,
    userNotExistsInOrganizationManagementSchema,
    userNotExistInOrganizationSchema,
    userDisabledSchema,
    tokenNotFoundSchema,

    invalidIDSchema,

    formValidationFailedSchema,

    selfPermissionMismatchSchema,
    invalidActorSchema,
    permissionExplicitlyDeniedSchema,
    missingPermissionSchema,

    invalidMultipartNumberSchema,
    mediaObjectNotFoundSchema,
    mediaTooLargeSchema,
    mediaItemsLimitExceededSchema,
    uploadAlreadyCompletedSchema,
    unsupportedObjectUploadedSchema,
    completeMultipartUploadCalledTooSoonSchema,

    invalidCursorValueSchema,

    invalidRequestBodySchema,
    unknownFieldInRequestBodySchema,
    requestBodyTooLargeSchema,
    emptyRequestBodySchema,

    malformedJSONFromServerSchema,
    invalidResponseShapeSchema,
    unknownServerErrorSchema,
]);
