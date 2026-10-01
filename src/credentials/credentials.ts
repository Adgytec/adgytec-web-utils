import { z } from "zod";

/**
 * Schema validating temporary cloud and object storage credentials (e.g. AWS STS or S3-compatible storage).
 */
export const CredentialsSchema = z.object({
    accessKeyID: z.string().nullable(),
    expiration: z.coerce.date().nullable(),
    secretAccessKey: z.string().nullable(),
    sessionToken: z.string().nullable(),
});

/**
 * Describes temporary cloud and object storage credentials used to authorize storage operations.
 */
export type Credentials = z.infer<typeof CredentialsSchema>;
