import z from "zod";
import { iamCodes } from "../errorCodes";

export const selfPermissionMismatchSchema = z.object({
    code: z.literal(iamCodes.selfPermissionMismatch),
    details: z.object({
        permission: z.string(),
        key: z.string(),
        required: z.string(),
        got: z.string(),
    }),
});

export const invalidActorSchema = z.object({
    code: z.literal(iamCodes.invalidActor),
    details: z.object({
        supportedActors: z.array(z.string()),
        currentActor: z.string(),
    }),
});

export const permissionExplicitlyDeniedSchema = z.object({
    code: z.literal(iamCodes.permissionExplicitlyDenied),
    details: z.object({
        deniedPermission: z.string(),
    }),
});

export const missingPermissionSchema = z.object({
    code: z.literal(iamCodes.missingPermission),
    details: z.object({
        missingPermission: z.string(),
    }),
});
