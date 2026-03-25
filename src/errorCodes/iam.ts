import type { ErrorNormalization } from "../errors";

export const iamCodes = {
    selfPermissionMismatch: "self-permission-mismatch",
    invalidActor: "invalid-actor",
    permissionExplicitlyDenied: "permission-explicitly-denied",
    missingPermission: "missing-permission",
} as const;

export const iamOverrides: ErrorNormalization = {
    code: "authorization-error",
    items: [iamCodes.selfPermissionMismatch, iamCodes.invalidActor],
} as const;
