# Credentials

Exports from `src/credentials`.

Zod validation schemas and TypeScript types for temporary cloud and object storage credentials (such as AWS STS or S3-compatible storage).

These schemas validate temporary access keys, secret keys, session tokens, and expiration dates returned by authorization services before performing direct cloud storage operations.

---

## Schemas & Types Overview

| Schema | Type | Description |
| --- | --- | --- |
| `CredentialsSchema` | `Credentials` | Validates temporary cloud credentials (`accessKeyID`, `expiration`, `secretAccessKey`, `sessionToken`). |

---

## Models & Schemas

### `CredentialsSchema` & `Credentials`

Validates temporary cloud and object storage credentials.

```ts
export const CredentialsSchema = z.object({
  accessKeyID: z.string().nullable(),
  expiration: z.coerce.date().nullable(),
  secretAccessKey: z.string().nullable(),
  sessionToken: z.string().nullable(),
});

export type Credentials = z.infer<typeof CredentialsSchema>;
```

#### Fields

- `accessKeyID` (`string | null`): The access key identifier for the temporary session or service account, or `null` if unauthenticated or omitted.
- `expiration` (`Date | null`): The timestamp when the credentials expire, coerced to a JavaScript `Date` instance, or `null` if no expiration is specified.
- `secretAccessKey` (`string | null`): The secret access key used to sign requests, or `null` if unauthenticated or omitted.
- `sessionToken` (`string | null`): The security session token (STS token) associated with temporary credentials, or `null` if not required.

---

## Example Usage

### 1. Validating Server-Issued Temporary Credentials

Use `CredentialsSchema.safeParse()` to validate credential payloads received from backend endpoints:

```ts
import { CredentialsSchema } from "adgytec-web-utils";

const rawCredentials = {
  accessKeyID: "ASIAEXAMPLEKEY123",
  expiration: "2026-10-01T15:30:00.000Z",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  sessionToken: "AQoDYXdzEJr1...",
};

const result = CredentialsSchema.safeParse(rawCredentials);

if (result.success) {
  // result.data.expiration is coerced into a native Date object
  console.log("Credentials expire at:", result.data.expiration?.toISOString());
  console.log("Access Key ID:", result.data.accessKeyID);
} else {
  console.error("Invalid credentials received:", result.error);
}
```

### 2. Decoding Credentials with `decodeAPIResponse`

Validate credentials returned from an authentication or token vendor endpoint directly with `decodeAPIResponse`:

```ts
import { decodeAPIResponse, CredentialsSchema, type Credentials } from "adgytec-web-utils";

async function fetchTemporaryCredentials(): Promise<Credentials> {
  const response = await fetch("/api/storage/credentials");
  return decodeAPIResponse(response, CredentialsSchema);
}
```

### 3. Checking Credential Expiration

Check whether temporary credentials are valid or need refresh before executing storage operations:

```ts
import type { Credentials } from "adgytec-web-utils";

function isCredentialsExpired(credentials: Credentials | null): boolean {
  if (!credentials || !credentials.expiration) {
    return false;
  }
  // Buffer of 60 seconds to avoid edge-of-expiration failures
  const bufferMs = 60 * 1000;
  return Date.now() + bufferMs >= credentials.expiration.getTime();
}
```

### 4. Integration with AWS SDK / S3 Client

Supply validated credentials directly to standard AWS SDK v3 clients:

```ts
import { S3Client } from "@aws-sdk/client-s3";
import type { Credentials } from "adgytec-web-utils";

function createS3Client(region: string, credentials: Credentials | null): S3Client {
  return new S3Client({
    region,
    credentials:
      credentials?.accessKeyID && credentials.secretAccessKey
        ? {
            accessKeyId: credentials.accessKeyID,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.sessionToken ?? undefined,
            expiration: credentials.expiration ?? undefined,
          }
        : undefined,
  });
}
```
