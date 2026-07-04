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

## `fieldValidationCodes`

Field validation error codes describing the shape of failures in `FlattenedErrors`.

| Key | Code | Description |
| --- | --- | --- |
| `unknown` | `"unknown-error"` | An uncategorized validation error occurred. |
| `nil` | `"validation_nil"` | Value cannot be nil. |
| `empty` | `"validation_empty"` | Value cannot be empty. |
| `dateInvalid` | `"validation_date_invalid"` | Provided date is invalid. |
| `dateTooEarly` | `"validation_date_too_early"` | Provided date is earlier than allowed minimum. |
| `dateTooLate` | `"validation_date_too_late"` | Provided date is later than allowed maximum. |
| `dateOutOfRange` | `"validation_date_out_of_range"` | Provided date is out of allowable range. |
| `lengthTooLong` | `"validation_length_too_long"` | Value length exceeds the maximum limit. |
| `lengthTooShort` | `"validation_length_too_short"` | Value length is below the minimum limit. |
| `lengthInvalid` | `"validation_length_invalid"` | Value length does not match exact constraints. |
| `lengthOutOfRange` | `"validation_length_out_of_range"` | Value length is out of range. |
| `lengthEmptyRequired` | `"validation_length_empty_required"` | Value cannot be empty when length constraint is set. |
| `keyWrongType` | `"validation_key_wrong_type"` | Key value has an incorrect type. |
| `keyMissing` | `"validation_key_missing"` | Required key is missing. |
| `keyUnexpected` | `"validation_key_unexpected"` | Unexpected key is present. |
| `minGreaterEqualThanRequired` | `"validation_min_greater_equal_than_required"` | Value must be greater than or equal to the minimum. |
| `maxLessEqualThanRequired` | `"validation_max_less_equal_than_required"` | Value must be less than or equal to the maximum. |
| `minGreaterThanRequired` | `"validation_min_greater_than_required"` | Value must be strictly greater than the minimum. |
| `maxLessThanRequired` | `"validation_max_less_than_required"` | Value must be strictly less than the maximum. |
| `required` | `"validation_required"` | Field is required. |
| `nilOrNotEmptyRequired` | `"validation_nil_or_not_empty_required"` | Field must not be nil or empty. |
| `inInvalid` | `"validation_in_invalid"` | Value must be in the specified list of allowed values. |
| `matchInvalid` | `"validation_match_invalid"` | Value does not match required format or regex pattern. |
| `multipleOfInvalid` | `"validation_multiple_of_invalid"` | Value must be a multiple of the specified number. |
| `notInInvalid` | `"validation_not_in_invalid"` | Value must not be in the specified list of forbidden values. |
| `notNilRequired` | `"validation_not_nil_required"` | Value must not be nil. |
| `isEmail` | `"validation_is_email"` | Value must be a valid email address. |
| `isURL` | `"validation_is_url"` | Value must be a valid URL. |
| `isRequestURL` | `"validation_is_request_url"` | Value must be a valid request URL. |
| `requestIsRequestURI` | `"validation_request_is_request_uri"` | Value must be a valid request URI. |
| `isAlpha` | `"validation_is_alpha"` | Value must contain only alphabetic characters. |
| `isDigit` | `"validation_is_digit"` | Value must contain only digit characters. |
| `isAlphanumeric` | `"validation_is_alphanumeric"` | Value must contain only alphanumeric characters. |
| `isUTFLetter` | `"validation_is_utf_letter"` | Value must contain only UTF letters. |
| `isUTFDigit` | `"validation_is_utf_digit"` | Value must contain only UTF digits. |
| `isUTFLetterNumeric` | `"validation_is utf_letter_numeric"` | Value must contain only UTF letters or digits. |
| `isUTFNumeric` | `"validation_is_utf_numeric"` | Value must contain only UTF numeric characters. |
| `isLowerCase` | `"validation_is_lower_case"` | Value must be in lower case. |
| `isUpperCase` | `"validation_is_upper_case"` | Value must be in upper case. |
| `isHexadecimal` | `"validation_is_hexadecimal"` | Value must be a valid hexadecimal string. |
| `isHexColor` | `"validation_is_hex_color"` | Value must be a valid hexadecimal color code. |
| `isRGBColor` | `"validation_is_rgb_color"` | Value must be a valid RGB color code. |
| `isInt` | `"validation_is_int"` | Value must be an integer. |
| `isFloat` | `"validation_is_float"` | Value must be a floating point number. |
| `isUUIDv3` | `"validation_is_uuid_v3"` | Value must be a valid UUID version 3. |
| `isUUIDv4` | `"validation_is_uuid_v4"` | Value must be a valid UUID version 4. |
| `isUUIDv5` | `"validation_is_uuid_v5"` | Value must be a valid UUID version 5. |
| `isUUID` | `"validation_is_uuid"` | Value must be a valid UUID. |
| `isCreditCard` | `"validation_is_credit_card"` | Value must be a valid credit card number. |
| `isISBN10` | `"validation_is_isbn_10"` | Value must be a valid ISBN-10 number. |
| `isISBN13` | `"validation_is_isbn_13"` | Value must be a valid ISBN-13 number. |
| `isISBN` | `"validation_is_isbn"` | Value must be a valid ISBN number. |
| `isJSON` | `"validation_is_json"` | Value must be a valid JSON string. |
| `isASCII` | `"validation_is_ascii"` | Value must contain only ASCII characters. |
| `isPrintableASCII` | `"validation_is_printable_ascii"` | Value must contain only printable ASCII characters. |
| `isMultibyte` | `"validation_is_multibyte"` | Value must contain multibyte characters. |
| `isFullWidth` | `"validation_is_full_width"` | Value must contain full-width characters. |
| `isHalfWidth` | `"validation_is_half_width"` | Value must contain half-width characters. |
| `isVariableWidth` | `"validation_is_variable_width"` | Value must contain variable-width characters. |
| `isBase64` | `"validation_is_base64"` | Value must be a valid Base64 encoded string. |
| `isDataURI` | `"validation_is_data_uri"` | Value must be a valid Data URI. |
| `isE164Number` | `"validation_is_e164_number"` | Value must be a valid E.164 phone number. |
| `isCountryCode2Letter` | `"validation_is_country_code_2_letter"` | Value must be a valid 2-letter ISO country code. |
| `isCountryCode3Letter` | `"validation_is_country_code_3_letter"` | Value must be a valid 3-letter ISO country code. |
| `isCurrencyCode` | `"validation_is_currency_code"` | Value must be a valid 3-letter ISO currency code. |
| `isDialString` | `"validation_is_dial_string"` | Value must be a valid dial string. |
| `isMACAddress` | `"validation_is_mac_address"` | Value must be a valid MAC address. |
| `isIP` | `"validation_is_ip"` | Value must be a valid IP address. |
| `isIPv4` | `"validation_is_ipv4"` | Value must be a valid IPv4 address. |
| `isIPv6` | `"validation_is_ipv6"` | Value must be a valid IPv6 address. |
| `isSubDomain` | `"validation_is_sub_domain"` | Value must be a valid subdomain. |
| `isDomain` | `"validation_is_domain"` | Value must be a valid domain. |
| `isDNSName` | `"validation_is_dns_name"` | Value must be a valid DNS name. |
| `isHost` | `"validation_is_host"` | Value must be a valid host (domain or IP). |
| `isPort` | `"validation_is_port"` | Value must be a valid port number. |
| `isMongoID` | `"validation_is_mongo_id"` | Value must be a valid MongoDB ObjectID. |
| `isLatitude` | `"validation_is_latitude"` | Value must be a valid latitude coordinate. |
| `isLongitude` | `"validation_is_longitude"` | Value must be a valid longitude coordinate. |
| `isSSN` | `"validation_is_ssn"` | Value must be a valid Social Security Number. |
| `isSemver` | `"validation_is_semver"` | Value must be a valid semantic version. |


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

