# Error Schemas

Exports from `src/errorSchema`.

All schema exports are Zod schemas. They can be used to validate API error payloads, infer TypeScript types, compose additional validation schemas, or drive client-side UI error states.

---

## The Client-Side Error Parsing Pipeline

When consuming a JSON response from an API, use the root `errorSchema` to validate the error format and narrow it down to the exact error shape.

### Complete Pipeline Example

```ts
import { errorSchema, parseError, normalizeError } from "adgytec-web-utils";

async function makeAPICall() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      const payload = await response.json();
      
      // 1. Validate the response against the schema
      const parsed = errorSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("Unknown error format received:", parsed.error);
        return;
      }
      
      const errorDetails = parsed.data; // Type-safe union of all supported errors
      
      // 2. Handle specific error codes
      switch (errorDetails.code) {
        case "validation-failed":
          // Form-level validation error
          highlightFormErrors(errorDetails.details);
          break;
          
        case "media-too-large":
          // Media specific error
          alert(`File ${errorDetails.mediaID} is too large (${errorDetails.currentSize} bytes). Max limit is ${errorDetails.maxSupportedSize} bytes.`);
          break;
          
        case "bad-org-status":
          showAccountSuspendedScreen();
          break;
          
        default:
          // 3. Fallback to normalized error for generic handling
          const normalized = normalizeError(errorDetails);
          console.warn(`Normalized code: ${normalized.code}`);
          showGenericNotification("An error occurred. Please try again.");
          break;
      }
    }
  } catch (err) {
    // Connection or parser failure
    const errorDetails = parseError(err);
    console.error(`Parsed network/runtime error code: ${errorDetails.code}`);
  }
}
```

---

## Auth Schemas

Schemas validating authentication, API key, and JWT token signatures.

| Export Schema | Validates Code | Additional Fields |
| --- | --- | --- |
| `authErrorSchema` | `"auth-error"` | None |
| `invalidApiKeySchema` | `"invalid-api-key"` | None |
| `userNotFoundSchema` | `"user-not-found"` | None |
| `jwtNotAcceptableSchema` | `"jwt-not-acceptable"` | None |
| `invalidSignedUrlSchema` | `"invalid-signed-url"` | None |
| `hashMismatchSchema` | `"hash-mismatch"` | None |
| `invalidAuthHeaderValueSchema` | `"invalid-auth-header-value"` | None |
| `unsupportedAuthSchemeSchema` | `"unsupported-auth-scheme"` | None |
| `organizationStatusBadSchema` | `"bad-org-status"` | None |
| `userNotExistsInOrganizationManagementSchema` | `"user-not-exists-in-organization-management"` | None |
| `userNotExistInOrganizationSchema` | `"user-not-exists-in-organization"` | None |
| `userDisabledSchema` | `"user-disabled"` | None |
| `tokenNotFoundSchema` | `"token-not-found"` | None |
| `invalidJWTSchema` | `"invalid-jwt"` | None |
| `invalidSessionSchema` | `"invalid-session"` | None |
| `tokenExpiredSchema` | `"token-expired"` | None |

---

## Common Schemas

Generic failure schemas applicable to any resource request.

| Export Schema | Validates Code | Additional Fields |
| --- | --- | --- |
| `invalidIDSchema` | `"invalid-id"` | None |
| `routeNotFoundSchema` | `"route-not-found"` | None |
| `methodNotAllowedSchema` | `"method-not-allowed"` | None |
| `networkErrorSchema` | `"network-error"` | `debugMessage?: string` |
| `unexpectedErrorSchema` | `"unexpected-error"` | `debugMessage?: string` |
| `zodErrorSchema` | `"zod-error"` | `error: z.ZodError` |

---

## Form Validation Schema & Field Trees

Form validation errors are structured recursively. A form can have nested field errors representing sub-objects in the form payload.

### Definitions

- **`FieldNode`**: A union type representing either a leaf field containing validation errors or a branch containing child nodes.
  ```ts
  export type FieldNode =
    | { key: string; errors: FormFieldError[] }
    | { key: string; children: FieldNode[] };
  ```
- **`formValidationFailedSchema`**: Top-level validator.
  - Inferred type: **`FormValidationFailed`**
  ```ts
  export const formValidationFailedSchema = z.object({
    code: z.literal("validation-failed"),
    details: z.array(fieldNodeSchema),
  });
  ```

### Nested Validation Example

```ts
import { formValidationFailedSchema } from "adgytec-web-utils";

const responsePayload = {
  code: "validation-failed",
  details: [
    {
      key: "user",
      children: [
        {
          key: "email",
          errors: [
            { type: "invalid", details: { cause: "invalid-email" } }
          ]
        },
        {
          key: "profile",
          children: [
            {
              key: "age",
              errors: [
                { type: "underflow", details: { min: 18 } }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const result = formValidationFailedSchema.safeParse(responsePayload);
if (result.success) {
  // Safe to navigate result.data.details
  console.log("Validated form errors:", result.data.details);
}
```

---

## Form Field Schemas and Types

`formFieldDiscriminatedUnionSchema` (inferred as type `FormFieldError`) validates individual field validation failures using a `"type"` discriminator.

| Export Schema | Type Value | Details Shape |
| --- | --- | --- |
| `fieldUnknownValidationErrorSchema` | `"unknown"` | None |
| `fieldMissingErrorSchema` | `"missing"` | None |
| `fieldOverflowErrorSchema` | `"overflow"` | `{ max: Date \| number }` |
| `fieldUnderflowErrorSchema` | `"underflow"` | `{ min: Date \| number }` |
| `fieldLengthErrorSchema` | `"length"` | `{ min: number; max: number }` |
| `fieldInvalidSchema` | `"invalid"` | `formFieldInvalidDiscriminatedUnion` |

### Example Usage

```ts
import { formFieldDiscriminatedUnionSchema } from "adgytec-web-utils";

const singleFieldError = {
  type: "overflow",
  details: { max: 10 },
};

const parsed = formFieldDiscriminatedUnionSchema.safeParse(singleFieldError);
if (parsed.success) {
  console.log("Field size exceeded maximum limit of:", parsed.data.details.max);
}
```

---

## Form Field Invalid Cause Schemas

`formFieldInvalidDiscriminatedUnion` handles cases where a field value format is invalid, using the `"cause"` field as a discriminator.

| Export Schema | Cause Value | Additional Fields |
| --- | --- | --- |
| `invalidValueErrorSchema` | `"invalid-value"` | None |
| `invalidEnumValueErrorSchema` | `"invalid-enum-value"` | `possibleValues: string[]` |
| `requireHttpsErrorSchema` | `"require-https"` | None |
| `missingHostErrorSchema` | `"missing-host"` | None |
| `containsPathErrorSchema` | `"contains-path"` | None |
| `containsQueryErrorSchema` | `"contains-query"` | None |
| `containsFragmentErrorSchema` | `"contains-fragment"` | None |
| `absoluteUrlErrorSchema` | `"absolute-url"` | None |
| `nilIDErrorSchema` | `"nil-id"` | None |
| `invalidEmailErrorSchema` | `"invalid-email"` | None |
| `missingMxRecordsErrorSchema` | `"missing-mx-records"` | None |
| `notDigitErrorSchema` | `"not-digit"` | None |
| `notBase64UrlEncodedErrorSchema`| `"not-base64-url-encoded"` | None |
| `invalidUrlErrorSchema` | `"invalid-url"` | None |
| `nullValueErrorSchema` | `"null-value"` | None |

### Example Usage

```ts
import { formFieldInvalidDiscriminatedUnion } from "adgytec-web-utils";

const responseCause = {
  cause: "invalid-enum-value",
  possibleValues: ["Admin", "Member", "Viewer"],
};

const parsed = formFieldInvalidDiscriminatedUnion.safeParse(responseCause);
if (parsed.success && parsed.data.cause === "invalid-enum-value") {
  console.log("Allowed values:", parsed.data.possibleValues.join(", "));
}
```

---

## IAM Schemas

Schemas validating identity and access management rule violations.

| Export Schema | Validates Code | Additional Fields |
| --- | --- | --- |
| `authorizationErrorSchema` | `"authorization-error"` | None |
| `selfPermissionMismatchSchema` | `"self-permission-mismatch"` | None |
| `invalidActorSchema` | `"invalid-actor"` | None |
| `permissionExplicitlyDeniedSchema` | `"permission-explicitly-denied"` | None |
| `missingPermissionSchema` | `"missing-permission"` | None |

---

## Media Upload Schemas

Schemas for client/server upload operations.

| Export Schema | Validates Code | Additional Fields |
| --- | --- | --- |
| `mediaUploadErrorSchema` | `"media-upload-error"` | None |
| `invalidMultipartNumberSchema` | `"invalid-multipart-upload-part-number"` | None |
| `mediaObjectNotFoundSchema` | `"object-not-found"` | None |
| `mediaTooLargeSchema` | `"media-too-large"` | `mediaID: string`, `currentSize: number`, `maxSupportedSize: number` |
| `mediaItemsLimitExceededSchema` | `"media-items-limit-exceeded"` | `currentLength: number`, `maxItemsSupported: number` |
| `uploadAlreadyCompletedSchema` | `"upload-already-completed"` | None |
| `unsupportedObjectUploadedSchema` | `"unsupported-object-uploaded"` | None |
| `completeMultipartUploadCalledTooSoonSchema`| `"complete-multipart-upload-called-too-soon"`| None |
| `singlepartUploadFailedSchema` | `"singlepart-upload-failed"`| `mediaID: string` |
| `multipartPartUploadFailedSchema` | `"multipart-part-upload-failed"`| `mediaID: string`, `partNumber: number` |
| `missingETagValueSchema` | `"missing-etag-value"` | `mediaID: string`, `partNumber: number` |

---

## Root Error Schema and Type Utilities

- **`errorSchema`**: A Zod discriminated union of all error schemas listed above.
- **`ErrorCode`**: TypeScript union of all error code strings.
- **`ErrorDetails`**: TypeScript union of all validated error payload shapes.
- **`ErrorDetailsNormalized`**: Error shapes after overrides (child codes) are removed.
- **`NormalizedErrorCode`**: Code union for normalized error shapes.

---

## Error Factory Functions

Use these helper functions to quickly construct and throw validation-compliant `ApplicationError` objects.

### `newMediaItemsLimitExceedError(currentLength, maxItemsSupported)`

Throws an `ApplicationError` representing `media-items-limit-exceeded`.

```ts
import { newMediaItemsLimitExceedError, MediaItemsLimit } from "adgytec-web-utils";

function validateSelection(files: File[]) {
  if (files.length > MediaItemsLimit) {
    newMediaItemsLimitExceedError(files.length, MediaItemsLimit);
  }
}
```

### `newMediaTooLargeError(fileName, currentSize, maxSupportedSize)`

Throws an `ApplicationError` representing `media-too-large`.

```ts
import { newMediaTooLargeError, MediaUploadLimit } from "adgytec-web-utils";

function validateFileSize(file: File) {
  if (file.size > MediaUploadLimit) {
    newMediaTooLargeError(file.name, file.size, MediaUploadLimit);
  }
}
```

