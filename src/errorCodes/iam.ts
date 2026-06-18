import type { ErrorNormalization } from "../errors";

export const iamCodes = {
    authorizationError: "authorization-error",
    selfPermissionMismatch: "self-permission-mismatch",
    invalidActor: "invalid-actor",
    permissionExplicitlyDenied: "permission-explicitly-denied",
    missingPermission: "missing-permission",
} as const;

export const iamOverrides = {
    code: iamCodes.authorizationError,
    items: [iamCodes.selfPermissionMismatch, iamCodes.invalidActor],
} as const satisfies ErrorNormalization;
