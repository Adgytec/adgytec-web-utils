# Error Codes

Error-code exports are grouped by domain. Use these constants instead of hard-coded strings when comparing, constructing, or normalizing errors.

These values represent the stable wire format for this package. The same code appears in `ApplicationError.details`, `errorSchema`, and normalized server responses.

---

## Domain Error Codes

### `authCodes`

Authentication and signature verification error codes.

| Key | Code | Description |
| --- | --- | --- |
| `invalidSignedUrl` | `"invalid-signed-url"` | Signed URL signature is invalid or expired. |
| `invalidJWT` | `"invalid-jwt"` | JSON Web Token structure or signature is invalid. |

---

### `constraintsCodes`

Operational limits and constraint-violation error codes.

| Key | Code | Description |
| --- | --- | --- |
| `limitReached` | `"limit-reached"` | A system limit or usage quota threshold has been reached. |

---

### `formCodes`

Form-level validation error codes.

| Key | Code | Description |
| --- | --- | --- |
| `formValidationFailed` | `"validation-failed"` | Top-level code returned when form validation fails. |

---

### `fieldValidationCodes`

Granular field-level validation error codes describing specific validation failures in `FlattenedErrors`.

| Key | Code | Description |
| --- | --- | --- |
| `unknown` | `"unknown-error"` | Uncategorized field validation error. |
| `nil` | `"validation_nil"` | Value cannot be nil. |
| `empty` | `"validation_empty"` | Value cannot be empty. |
| `dateInvalid` | `"validation_date_invalid"` | Provided date is invalid. |
| `dateTooEarly` | `"validation_date_too_early"` | Date is earlier than minimum allowed. |
| `dateTooLate` | `"validation_date_too_late"` | Date is later than maximum allowed. |
| `dateOutOfRange` | `"validation_date_out_of_range"` | Date is out of allowable range. |
| `lengthTooLong` | `"validation_length_too_long"` | String or collection exceeds maximum length. |
| `lengthTooShort` | `"validation_length_too_short"` | String or collection is below minimum length. |
| `lengthInvalid` | `"validation_length_invalid"` | Length does not match exact constraint. |
| `lengthOutOfRange` | `"validation_length_out_of_range"` | Length is out of range. |
| `lengthEmptyRequired` | `"validation_length_empty_required"` | Value must be empty. |
| `keyWrongType` | `"validation_key_wrong_type"` | Key value has incorrect type. |
| `keyMissing` | `"validation_key_missing"` | Required key is missing. |
| `keyUnexpected` | `"validation_key_unexpected"` | Unexpected key present. |
| `minGreaterEqualThanRequired` | `"validation_min_greater_equal_than_required"` | Value must be greater than or equal to minimum. |
| `maxLessEqualThanRequired` | `"validation_max_less_equal_than_required"` | Value must be less than or equal to maximum. |
| `minGreaterThanRequired` | `"validation_min_greater_than_required"` | Value must be strictly greater than minimum. |
| `maxLessThanRequired` | `"validation_max_less_than_required"` | Value must be strictly less than maximum. |
| `required` | `"validation_required"` | Field is required. |
| `nilOrNotEmptyRequired` | `"validation_nil_or_not_empty_required"` | Field must not be nil or empty. |
| `inInvalid` | `"validation_in_invalid"` | Value must be one of allowed options. |
| `matchInvalid` | `"validation_match_invalid"` | Value does not match format or regex. |
| `multipleOfInvalid` | `"validation_multiple_of_invalid"` | Value must be a multiple of base number. |
| `notInInvalid` | `"validation_not_in_invalid"` | Value must not be in disallowed list. |
| `notNilRequired` | `"validation_not_nil_required"` | Value must not be nil. |
| `isEmail` | `"validation_is_email"` | Value must be a valid email address. |
| `isURL` | `"validation_is_url"` | Value must be a valid URL. |
| `isUUID` | `"validation_is_uuid"` | Value must be a valid UUID. |
| `isJSON` | `"validation_is_json"` | Value must be a valid JSON string. |

---

### `mediaCodes`

Asset and media upload error codes.

| Key | Code | Description |
| --- | --- | --- |
| `mediaTooLarge` | `"media-too-large"` | File size exceeds maximum allowed upload limit. |
| `duplicatedMediaID` | `"duplicate-media-id"` | The provided media identifier is already in use. |

---

### `middlewareCodes`

Request pipeline and access control middleware error codes.

| Key | Code | Description |
| --- | --- | --- |
| `workspaceForbidden` | `"workspace-forbidden"` | Access to workspace is forbidden. |
| `actorForbidden` | `"actor-forbidden"` | Actor role lacks required privileges. |
| `actorNotInWorkspace` | `"actor-not-in-workspace"` | Actor is not a member of the target workspace. |
| `unsupportedAuthScheme` | `"unsupported-auth-scheme"` | Authorization header scheme is not supported. |
| `invalidAuthHeader` | `"invalid-auth-header"` | Authorization header format is malformed. |
| `moduleNotInWorkspace` | `"module-not-in-workspace"` | Required module is not enabled for this workspace. |

---

### `miscCodes`

General server, network, and parser runtime error codes.

| Key | Code | Description |
| --- | --- | --- |
| `malformedResponseBody` | `"malformed-response-body"` | Response body stream could not be read. |
| `malformedJsonFromServer` | `"malformed-json-from-server"` | Response body failed JSON deserialization. |
| `invalidResponseShape` | `"invalid-response-shape"` | Response payload violated expected schema. |
| `unknownServerError` | `"unknown-server-error"` | Server returned an error status without an error code. |
| `internalServerError` | `"internal-server-error"` | Server returned an HTTP 500 error status. |
| `routeNotFound` | `"route-not-found"` | Request path is not registered (HTTP 404). |
| `methodNotAllowed` | `"method-not-allowed"` | HTTP method is not supported on this endpoint (HTTP 405). |
| `networkError` | `"network-error"` | Client could not reach the server. |
| `unexpectedError` | `"unexpected-error"` | Generic unexpected runtime error or normalized override target. |
| `zodError` | `"zod-error"` | Zod schema validation failure. |

---

### `payloadCodes`

HTTP request body payload error codes.

| Key | Code | Description |
| --- | --- | --- |
| `invalidRequestBody` | `"invalid-request-body"` | Request body is malformed or invalid. |
| `unknownFieldInRequestBody` | `"unknown-field-in-request-body"` | Request body contains unrecognized properties. |
| `emptyRequestBody` | `"empty-request-body"` | Request body was unexpectedly empty. |
| `requestBodyTooLarge` | `"request-body-too-large"` | Request body size exceeds the allowed byte limit. |

---

### `permissionCodes`

Authorization and workspace resolution error codes.

| Key | Code | Description |
| --- | --- | --- |
| `permissionDenied` | `"permission-denied"` | Caller does not have the required permission. |
| `workspaceNotFound` | `"workspace-not-found"` | Target workspace was not found. |

---

### `reqParamsCodes`

Route parameter and query identifier error codes.

| Key | Code | Description |
| --- | --- | --- |
| `invalidID` | `"invalid-id"` | Provided resource or path parameter ID is invalid. |

---

## Overrides and Error Normalization

Certain granular error codes are considered internal implementation details and are mapped to `unexpected-error` when normalized with `normalizeError`:

```ts
import { defaultOverrides, type DefaultOverridesCode } from "adgytec-web-utils";
```

### Active Overrides
- **Media**: `duplicate-media-id`
- **Payload**: `invalid-request-body`, `unknown-field-in-request-body`, `empty-request-body`, `request-body-too-large`
- **Misc**: `malformed-json-from-server`, `malformed-response-body`, `invalid-response-shape`, `route-not-found`, `method-not-allowed`, `zod-error`
- **Request Params**: `invalid-id`
- **Middleware**: `unsupported-auth-scheme`, `invalid-auth-header`
