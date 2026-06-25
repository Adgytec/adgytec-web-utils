# Error Codes

Error-code exports are grouped by domain. Use these constants instead of hard-coded strings when comparing, constructing, or normalizing errors.

These values are the stable wire format for this package. The same code may appear in `ApplicationError.details`, `errorSchema`, and normalized server responses.

---

## `authCodes`

Authentication and signed URL error codes.

| Key | Code | Description |
| --- | --- | --- |
| `authError` | `"auth-error"` | Generic authentication failure. |
| `invalidApiKey` | `"invalid-api-key"` | Provided API key is incorrect or expired. |
| `userNotFound` | `"user-not-found"` | The requested user could not be found. |
| `jwtNotAcceptable` | `"jwt-not-acceptable"` | Provided JSON Web Token is invalid or expired. |
| `invalidSignedUrl` | `"invalid-signed-url"` | The signed URL has expired or has an invalid signature. |
| `hashMismatch` | `"hash-mismatch"` | Signature verification failed. |
| `invalidAuthHeaderValue` | `"invalid-auth-header-value"` | `Authorization` header format is invalid. |
| `organizationStatusBad` | `"bad-org-status"` | The organization is suspended or inactive. |
| `userNotExistsInOrganizationManagement` | `"user-not-exists-in-organization-management"` | User is not in the organization management team. |
| `userNotExistInOrganization` | `"user-not-exists-in-organization"` | User does not belong to the specified organization. |
| `userDisabled` | `"user-disabled"` | User account is deactivated. |
| `tokenNotFound` | `"token-not-found"` | The authentication token is missing. |
| `unsupportedAuthScheme` | `"unsupported-auth-scheme"` | The authorization scheme is not supported. |
| `invalidJWT` | `"invalid-jwt"` | The provided JSON Web Token signature or structure is invalid. |
| `invalidSession` | `"invalid-session"` | The session is invalid, expired, or deactivated. |
| `tokenExpired` | `"token-expired"` | The authentication token has expired. |

---

## `commonCodes`

Common error codes shared across domains.

| Key | Code | Description |
| --- | --- | --- |
| `invalidId` | `"invalid-id"` | Provided database or resource ID has an invalid format. |
| `routeNotFound` | `"route-not-found"` | Request path is not registered. |
| `methodNotAllowed` | `"method-not-allowed"` | HTTP method is not allowed on this path. |
| `networkError` | `"network-error"` | Client could not establish a connection. |
| `unexpectedError` | `"unexpected-error"` | An unhandled exception or server-side crash occurred. |
| `zodError` | `"zod-error"` | Response or request validation schema failure. |

### Example Usage

```ts
import { commonCodes } from "adgytec-web-utils";

if (parsedError.code === commonCodes.zodError) {
  // Handle invalid structured payload (e.g., render error page, send telemetry)
  console.error("Payload mismatch:", parsedError.error);
}
```

---

## `formCodes`

Form-level error codes.

| Key | Code | Description |
| --- | --- | --- |
| `formValidationFailed` | `"validation-failed"` | Top-level code returned when a form schema validation fails. |

This is the top-level code returned by `formValidationFailedSchema`.

---

## `formFieldTypes`

Form field error type constants describing the shape of failures in `FlattenedErrors`.

| Key | Code | Description |
| --- | --- | --- |
| `missing` | `"missing"` | The field is required but was not provided. |
| `overflow` | `"overflow"` | The value exceeds the allowed maximum bound. |
| `underflow` | `"underflow"` | The value is below the allowed minimum bound. |
| `length` | `"length"` | The value length does not match exact constraints. |
| `invalid` | `"invalid"` | The field value is formatted incorrectly (e.g., bad email). |
| `unknown` | `"unknown"` | An uncategorized validation error occurred. |

---

## `formFieldInvalidTypeCauses`

Field-invalid cause constants. The `invalid` field type uses one of these causes to explain why a value is not acceptable.

| Key | Code | Description |
| --- | --- | --- |
| `invalidValue` | `"invalid-value"` | Generic invalid value. |
| `invalidEnumValue` | `"invalid-enum-value"` | Value is not one of the allowed options. |
| `requireHttps` | `"require-https"` | Protocol must be HTTPS. |
| `missingHost` | `"missing-host"` | Hostname is missing from the URI. |
| `containsPath` | `"contains-path"` | URI must not contain a path segment. |
| `containsQuery` | `"contains-query"` | URI must not contain a query string. |
| `containsFragment` | `"contains-fragment"` | URI must not contain a hash fragment. |
| `absoluteUrl` | `"absolute-url"` | URL must be absolute. |
| `nilID` | `"nil-id"` | ID cannot be a nil/empty UUID. |
| `invalidEmail` | `"invalid-email"` | Email format is invalid. |
| `missingMxRecords` | `"missing-mx-records"` | Email domain does not have valid MX records. |
| `notDigit` | `"not-digit"` | Value must contain only numeric digits. |
| `notBase64UrlEncoded` | `"not-base64-url-encoded"` | Value is not base64url encoded. |
| `invalidUrl` | `"invalid-url"` | URL format is invalid. |
| `nullValue` | `"null-value"` | Field cannot be null. |

---

## `iamCodes`

IAM and authorization error codes.

| Key | Code | Description |
| --- | --- | --- |
| `authorizationError` | `"authorization-error"` | User is unauthorized to perform the action. |
| `selfPermissionMismatch` | `"self-permission-mismatch"` | User cannot grant permissions they do not possess. |
| `invalidActor` | `"invalid-actor"` | The actor requesting the action is invalid/inactive. |
| `permissionExplicitlyDenied` | `"permission-explicitly-denied"` | Policy explicitly blocks this request. |
| `missingPermission` | `"missing-permission"` | User is missing required permission nodes. |

### Example Usage

```ts
import { iamCodes } from "adgytec-web-utils";

function handleIAMFailure(errorDetails: { code: string }) {
  if (errorDetails.code === iamCodes.missingPermission) {
    redirectToAccessDeniedPage();
  }
}
```

---

## `mediaCodes`

Media upload error codes.

| Key | Code | Description |
| --- | --- | --- |
| `mediaUploadError` | `"media-upload-error"` | Generic upload sequence error. |
| `invalidMultipartNumber` | `"invalid-multipart-upload-part-number"` | Part index is out of bounds or negative. |
| `mediaObjectNotFound` | `"object-not-found"` | Target storage object does not exist. |
| `mediaTooLarge` | `"media-too-large"` | File size exceeds the system limits. |
| `mediaItemsLimitExceeded` | `"media-items-limit-exceeded"` | Batch count exceeds the maximum limit. |
| `uploadAlreadyCompleted` | `"upload-already-completed"` | Target upload sequence is already finalized. |
| `unsupportedObjectUploaded` | `"unsupported-object-uploaded"` | The uploaded file type is not supported. |
| `completeMultipartUploadCalledTooSoon` | `"complete-multipart-upload-called-too-soon"` | Cannot close upload before all parts are received. |
| `singlepartUploadFailed` | `"singlepart-upload-failed"` | Direct PUT upload failed. |
| `multipartPartUploadFailed` | `"multipart-part-upload-failed"` | A specific chunk upload failed. |
| `missingETagValue` | `"missing-etag-value"` | The S3/GCS multipart ETag was missing in headers. |

### Example Usage

```ts
import { mediaCodes, ApplicationError, MediaUploadLimit } from "adgytec-web-utils";

function handleMediaUpload(file: File) {
  if (file.size > MediaUploadLimit) {
    throw new ApplicationError(mediaCodes.mediaTooLarge, {
      mediaID: file.name,
      currentSize: file.size,
      maxSupportedSize: MediaUploadLimit,
    });
  }
}
```

---

## `paginationCodes`

Pagination error codes.

| Key | Code | Description |
| --- | --- | --- |
| `invalidCursorValue` | `"invalid-cursor-value"` | The cursor string could not be parsed or is expired. |

---

## `requestBodyCodes`

Request body error codes.

| Key | Code | Description |
| --- | --- | --- |
| `invalidRequestBody` | `"invalid-request-body"` | The request body is not parseable. |
| `unknownFieldInRequestBody` | `"unknown-field-in-request-body"` | The payload contains unrecognized fields. |
| `emptyRequestBody` | `"empty-request-body"` | The request body is required but was empty. |
| `requestBodyTooLarge` | `"request-body-too-large"` | Payload size exceeds the maximum request body limit. |

---

## `restrictionCodes`

Restriction and limit error codes.

| Key | Code | Description |
| --- | --- | --- |
| `limitExceededCode` | `"limit-exceeded"` | The tenant or user quota has been exceeded. |

---

## `serverCodes`

Response parsing and server fallback error codes.

| Key | Code | Description |
| --- | --- | --- |
| `malformedResponseBody` | `"malformed-response-body"` | Response body reader crashed or could not be read. |
| `malformedJsonFromServer` | `"malformed-json-from-server"` | JSON parser failed on response string. |
| `invalidResponseShape` | `"invalid-response-shape"` | Expected response headers or shape is invalid. |
| `unknownServerError` | `"unknown-server-error"` | An undocumented server error was returned. |
| `internalServerError` | `"internal-server-error"` | Server returned HTTP 500 status. |

These codes are used by response parsing helpers when the server response cannot be decoded or trusted.

---

## Override Exports and Normalization Mappings

Override objects are used by `normalizeError` to map granular child errors into general parent categories.

| Export / Group | Parent Code (`code`) | Collapsed Child Codes (`items`) |
| --- | --- | --- |
| `authOverrides` | `auth-error` | `invalid-api-key`, `jwt-not-acceptable`, `invalid-auth-header-value`, `unsupported-auth-scheme`, `token-not-found`, `invalid-jwt`, `invalid-session`, `token-expired` |
| `signedURLOverrides` | `invalid-signed-url` | `hash-mismatch` |
| `commonOverrides` | `unexpected-error` | `invalid-id`, `route-not-found`, `method-not-allowed`, `zod-error` |
| `iamOverrides` | `authorization-error` | `self-permission-mismatch`, `invalid-actor` |
| `mediaOverrides` | `media-upload-error` | `invalid-multipart-upload-part-number`, `upload-already-completed`, `unsupported-object-uploaded`, `complete-multipart-upload-called-too-soon`, `singlepart-upload-failed`, `multipart-part-upload-failed`, `missing-etag-value` |
| `paginationOverrides`| `unexpected-error` | `invalid-cursor-value` |
| `reqBodyOverrides` | `unexpected-error` | `invalid-request-body`, `unknown-field-in-request-body`, `empty-request-body`, `request-body-too-large` |
| `serverOverrides` | `unexpected-error` | `malformed-json-from-server`, `malformed-response-body`, `invalid-response-shape` |
| `defaultOverrides` | *List of all above* | All override arrays concatenated. |
| `DefaultOverrideCode` | *Union type* | TypeScript union of all child codes mapped under `defaultOverrides`. |

