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
    unsupportedAuthSchemeSchema,
} from "./auth";
import {
    completeMultipartUploadCalledTooSoonSchema,
    invalidMultipartNumberSchema,
    mediaItemsLimitExceededSchema,
    mediaObjectNotFoundSchema,
    mediaTooLargeSchema,
    missingETagValueSchema,
    multipartPartUploadFailedSchema,
    singlepartUploadFailedSchema,
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
    organizationStatusBadSchema,
    userNotExistsInOrganizationManagementSchema,
    userNotExistInOrganizationSchema,
    userDisabledSchema,
    tokenNotFoundSchema,
    unsupportedAuthSchemeSchema,

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
    singlepartUploadFailedSchema,
    multipartPartUploadFailedSchema,
    missingETagValueSchema,

    invalidCursorValueSchema,

    invalidRequestBodySchema,
    unknownFieldInRequestBodySchema,
    requestBodyTooLargeSchema,
    emptyRequestBodySchema,

    malformedJSONFromServerSchema,
    invalidResponseShapeSchema,
    unknownServerErrorSchema,
]);

export type ErrorCode = z.infer<typeof errorSchema>["code"];

export type ErrorDetails = z.infer<typeof errorSchema>;
