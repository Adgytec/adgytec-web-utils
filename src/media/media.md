# Media

Exports from `src/media`.

Zod validation schemas and TypeScript types for direct cloud media uploads, upload object targets, regional groupings, and batch upload manifests.

These schemas establish a standard contract between the client application and backend upload authorization services when negotiating upload destinations, bucket keys, and temporary cloud storage credentials.

---

## Schemas & Types Overview

| Schema / Class | Type | Description |
| --- | --- | --- |
| `SingleUploadDetailsSchema` | `SingleUploadDetails` | Destination bucket, path, region, and credentials for a single media upload target. |
| `UploadObjectSchema` | `UploadObject` | Individual media item identified by UUID with target bucket and path. |
| `UploadGroupSchema` | `UploadGroup` | Batch of upload objects sharing common regional configuration and scoped credentials. |
| `UploadDetailsSchema` | `UploadDetails` | Complete batch upload specification containing one or more upload groups. |
| `MediaTooLargeError` | Class (`ApplicationError`) | Error thrown when a media file exceeds the maximum allowed file size. |

---

## Architecture: Upload Groups

When uploading multiple media files, different assets may target different storage buckets or regions, or the server may issue temporary STS credentials scoped to specific prefixes or buckets.

The `UploadGroup` structure organizes upload operations so that all items sharing identical credentials and region are processed under the same cloud storage client:

```mermaid
flowchart TD
    API["Backend Upload API"] -->|"Returns UploadDetails"| Client["Client Application"]
    Client --> Group1["UploadGroup 1 (Region A, Creds 1)"]
    Client --> Group2["UploadGroup 2 (Region B, Creds 2)"]

    Group1 --> Obj1["UploadObject (UUID 1 -> Bucket A/Path 1)"]
    Group1 --> Obj2["UploadObject (UUID 2 -> Bucket A/Path 2)"]

    Group2 --> Obj3["UploadObject (UUID 3 -> Bucket B/Path 3)"]
```

---

## Models & Schemas

### `SingleUploadDetailsSchema` & `SingleUploadDetails`

Validates destination parameters and credentials for a single media upload target.

```ts
export const SingleUploadDetailsSchema = z.object({
  region: z.string(),
  credentials: CredentialsSchema.nullable(),
  bucket: z.string(),
  path: z.string(),
});

export type SingleUploadDetails = z.infer<typeof SingleUploadDetailsSchema>;
```

#### Fields

- `region` (`string`): The cloud storage region (e.g., `"ap-south-1"`, `"us-east-1"`).
- `credentials` (`Credentials | null`): Temporary credentials conforming to [`CredentialsSchema`](../credentials/credentials.md), or `null` if unauthenticated or public.
- `bucket` (`string`): The destination cloud storage bucket name.
- `path` (`string`): The object key or path within the destination bucket.

---

### `UploadObjectSchema` & `UploadObject`

Validates an individual media item to be uploaded within an upload group.

```ts
export const UploadObjectSchema = z.object({
  id: z.uuid(),
  bucket: z.string(),
  path: z.string(),
});

export type UploadObject = z.infer<typeof UploadObjectSchema>;
```

#### Fields

- `id` (`string`): The unique UUID identifier representing the media object.
- `bucket` (`string`): The target cloud storage bucket name.
- `path` (`string`): The destination object key or path within the bucket.

---

### `UploadGroupSchema` & `UploadGroup`

Validates a group of upload objects that share common regional configuration and scoped temporary credentials.

```ts
export const UploadGroupSchema = z.object({
  numObjects: z.int(),
  region: z.string(),
  credentials: CredentialsSchema.nullable(),
  objects: z.array(UploadObjectSchema),
});

export type UploadGroup = z.infer<typeof UploadGroupSchema>;
```

#### Fields

- `numObjects` (`number`): The total count of upload objects in this group (integer).
- `region` (`string`): The cloud storage region applicable to all objects in this group.
- `credentials` (`Credentials | null`): Temporary storage credentials scoped to this upload group, or `null`.
- `objects` (`UploadObject[]`): Array of individual media items belonging to this group.

---

### `UploadDetailsSchema` & `UploadDetails`

Validates the complete batch upload details containing one or more upload groups.

```ts
export const UploadDetailsSchema = z.object({
  groups: z.array(UploadGroupSchema),
});

export type UploadDetails = z.infer<typeof UploadDetailsSchema>;
```

#### Fields

- `groups` (`UploadGroup[]`): Collection of upload groups comprising the batch upload manifest.

---

## Errors & Validation

### `MediaTooLargeError`

An `ApplicationError` subclass thrown when a client-side file selection exceeds the maximum allowed file size.

```ts
import { MediaTooLargeError } from "adgytec-web-utils";

function validateFileSize(file: File, maxSupportedSize: number) {
  if (file.size > maxSupportedSize) {
    throw new MediaTooLargeError(file, maxSupportedSize);
  }
}
```

- **Error Code**: `"media-too-large"`
- **Payload Details**: `{ file: File, size: number, maxSupportedSize: number, code: "media-too-large" }`

---

## Example Usage

### 1. Validating Single Upload Details

```ts
import { SingleUploadDetailsSchema } from "adgytec-web-utils";

const rawSingleUpload = {
  region: "ap-south-1",
  credentials: {
    accessKeyID: "AKIAIOSFODNN7EXAMPLE",
    expiration: "2026-10-01T16:00:00.000Z",
    secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    sessionToken: null,
  },
  bucket: "user-media-production",
  path: "avatars/0198a0e9-903c-7d4f-8246-317022e6523b.png",
};

const result = SingleUploadDetailsSchema.safeParse(rawSingleUpload);

if (result.success) {
  console.log("Validated single upload target:", result.data);
} else {
  console.error("Single upload validation failed:", result.error);
}
```

### 2. Fetching and Decoding Batch Upload Details

```ts
import { decodeAPIResponse, UploadDetailsSchema, type UploadDetails } from "adgytec-web-utils";

async function requestUploadTokens(fileMetadata: { name: string; size: number }[]): Promise<UploadDetails> {
  const response = await fetch("/api/media/upload-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files: fileMetadata }),
  });

  return decodeAPIResponse(response, UploadDetailsSchema);
}
```

### 3. Processing Batch Upload Groups

```ts
import type { UploadDetails } from "adgytec-web-utils";

async function executeBatchUpload(
  details: UploadDetails,
  fileMap: Map<string, File>
) {
  for (const group of details.groups) {
    console.log(`Processing group for region ${group.region} with ${group.numObjects} objects`);

    // Iterate through objects in the group
    for (const obj of group.objects) {
      const file = fileMap.get(obj.id);
      if (!file) {
        console.warn(`File with id ${obj.id} not found in map`);
        continue;
      }

      console.log(`Uploading file ${obj.id} to bucket ${obj.bucket} at ${obj.path}`);
      // Perform upload using group.credentials, obj.bucket, and obj.path
    }
  }
}
```
