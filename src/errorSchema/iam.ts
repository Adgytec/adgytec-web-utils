import z from "zod";
import {
    SELF_PERMISSION_MISMATCH,
    INVALID_ACTOR,
    PERMISSION_EXPLICITLY_DENIED,
    MISSING_PERMISSION,
} from "../errorCodes";

export const selfPermissionMismatchSchema = z.object({
    code: z.literal(SELF_PERMISSION_MISMATCH),
    details: z.object({
        permission: z.string(),
        key: z.string(),
        required: z.string(),
        got: z.string(),
    }),
});

export const invalidActorSchema = z.object({
    code: z.literal(INVALID_ACTOR),
    details: z.object({
        supportedActors: z.array(z.string()),
        currentActor: z.string(),
    }),
});

export const permissionExplicitlyDeniedSchema = z.object({
    code: z.literal(PERMISSION_EXPLICITLY_DENIED),
    details: z.object({
        deniedPermission: z.string(),
    }),
});

export const missingPermissionSchema = z.object({
    code: z.literal(MISSING_PERMISSION),
    details: z.object({
        missingPermission: z.string(),
    }),
});
