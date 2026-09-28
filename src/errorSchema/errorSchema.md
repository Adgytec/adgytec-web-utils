# Error Schemas

Exports from `src/errorSchema`.

All schema exports are Zod schemas. They validate API error payloads, infer TypeScript types, compose validation pipelines, and drive UI error state handling.

---

## The Client-Side Error Parsing Pipeline

When consuming responses from an API, use `parseError` to safely extract structured `ErrorDetails`, or use `errorSchema` directly to validate error payloads.

```ts
import { errorSchema, parseError, normalizeError } from "adgytec-web-utils";

async function handleAction() {
  try {
    const response = await fetch("/api/endpoint");
    if (!response.ok) {
      const payload = await response.json();
      
      // 1. Validate payload against errorSchema
      const parsed = errorSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("Unrecognized error shape:", parsed.error);
        return;
      }

      const errorDetails = parsed.data; // Type-safe union of all supported errors

      // 2. Branch on specific error code
      switch (errorDetails.code) {
        case "validation-failed":
          console.error("Form errors:", errorDetails.details);
          break;

        case "media-too-large":
          console.error(`File ${errorDetails.mediaID} is too large (${errorDetails.size} bytes). Max limit: ${errorDetails.maxSupportedSize}`);
          break;

        case "workspace-forbidden":
          console.error("Access denied to workspace:", errorDetails.workspaceID);
          break;

        default:
          // 3. Fallback to normalized error handling
          const normalized = normalizeError(errorDetails);
          console.warn(`Normalized code: ${normalized.code}`);
          break;
      }
    }
  } catch (err) {
    const errorDetails = parseError(err);
    console.error(`Parsed error code: ${errorDetails.code}`);
  }
}
```

---

## Root Error Schema and Type Utilities

- **`errorSchema`**: A Zod discriminated union of all supported error schemas.
- **`ErrorCode`**: TypeScript union of all error code strings.
- **`ErrorDetails`**: TypeScript union of all validated error payload shapes.
- **`ErrorDetailsNormalized`**: Error shapes after default overrides are mapped to `unexpected-error`.

---

## Error Schemas by Domain

### Authentication Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `invalidSignedUrlSchema` | `"invalid-signed-url"` | None |
| `invalidJWTSchema` | `"invalid-jwt"` | None |

---

### Constraints Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `limitReachedSchema` | `"limit-reached"` | `constraintKey: string`, `constraintCode: string`, `limit: number`, `currentValue: number` |

---

### Form Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `formValidationFailedSchema` | `"validation-failed"` | `details: FieldNode[]` |
| `formFieldDiscriminatedUnionSchema` | Individual `validation_*` codes | Constraint-specific fields (e.g., `min`, `max`, `debugMessage`) |

---

### Media Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `mediaTooLargeSchema` | `"media-too-large"` | `mediaID: string`, `size: number`, `maxSupportedSize: number` |
| `duplicateMediaIDSchema` | `"duplicate-media-id"` | `mediaID: string` |

---

### Middleware Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `workspaceForbiddenSchema` | `"workspace-forbidden"` | `workspaceID: string` |
| `actorForbiddenSchema` | `"actor-forbidden"` | `currentActor: string`, `requiredActor: string` |
| `actorNotInWorkspaceSchema` | `"actor-not-in-workspace"` | `workspaceID: string` |
| `unsupportedAuthSchemeSchema` | `"unsupported-auth-scheme"` | `currentScheme: string`, `supportedSchemes?: string[] \| null` |
| `invalidAuthHeaderSchema` | `"invalid-auth-header"` | None |
| `moduleNotInWorkspaceSchema` | `"module-not-in-workspace"` | `workspaceID: string`, `module: string` |

---

### Miscellaneous & Runtime Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `routeNotFoundSchema` | `"route-not-found"` | None |
| `methodNotAllowedSchema` | `"method-not-allowed"` | None |
| `networkErrorSchema` | `"network-error"` | `debugMessage: string` |
| `unexpectedErrorSchema` | `"unexpected-error"` | `debugMessage: string` |
| `zodErrorSchema` | `"zod-error"` | `error: ZodError` |
| `malformedResponseBodySchema` | `"malformed-response-body"` | `response: Response` |
| `malformedJSONFromServerSchema` | `"malformed-json-from-server"` | `response: Response` |
| `invalidResponseShapeSchema` | `"invalid-response-shape"` | `debugMessage: string`, `payload: unknown` |
| `unknownServerErrorSchema` | `"unknown-server-error"` | `payload: unknown` |
| `internalServerErrorSchema` | `"internal-server-error"` | None |

---

### Payload Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `invalidRequestBodySchema` | `"invalid-request-body"` | `debugMessage: string` |
| `unknownFieldInRequestBodySchema` | `"unknown-field-in-request-body"` | `debugMessage: string` |
| `requestBodyTooLargeSchema` | `"request-body-too-large"` | `limit: number` |
| `emptyRequestBodySchema` | `"empty-request-body"` | `debugMessage: string` |

---

### Permission Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `permissionDeniedSchema` | `"permission-denied"` | `permissionKey: string`, `permissionCode: string` |
| `workspaceNotFoundSchema` | `"workspace-not-found"` | None |

---

### Request Parameters Schemas

| Schema | Error Code | Additional Fields |
| --- | --- | --- |
| `invalidIDSchema` | `"invalid-id"` | `key: string` |
