import { z } from "zod";

export const CredentialsSchema = z.object({
    accessKeyID: z.string().nullable(),
    expiration: z.coerce.date().nullable(),
    secretAccessKey: z.string().nullable(),
    sessionToken: z.string().nullable(),
});

export type Credentials = z.infer<typeof CredentialsSchema>;
