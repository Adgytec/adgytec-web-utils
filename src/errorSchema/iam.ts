import z from "zod";
import { iamCodes } from "../errorCodes";

export const selfPermissionMismatchSchema = z.object({
    code: z.literal(iamCodes.selfPermissionMismatch),
    permission: z.string(),
    key: z.string(),
    required: z.string(),
    got: z.string(),
});

export const invalidActorSchema = z.object({
    code: z.literal(iamCodes.invalidActor),
    supportedActors: z.array(z.string()),
    currentActor: z.string(),
});

export const permissionExplicitlyDeniedSchema = z.object({
    code: z.literal(iamCodes.permissionExplicitlyDenied),
    deniedPermission: z.string(),
});

export const missingPermissionSchema = z.object({
    code: z.literal(iamCodes.missingPermission),
    missingPermission: z.string(),
});
