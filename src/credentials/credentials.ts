import { z } from "zod";

/**
 * Schema validating temporary cloud and object storage credentials (e.g. AWS STS or S3-compatible storage).
 */
export const CredentialsSchema = z.object({
    accessKeyID: z.string().nullish(),
    expiration: z.coerce.date().nullish(),
    secretAccessKey: z.string().nullish(),
    sessionToken: z.string().nullish(),
});

/**
 * Describes temporary cloud and object storage credentials used to authorize storage operations.
 */
export type Credentials = z.infer<typeof CredentialsSchema>;
