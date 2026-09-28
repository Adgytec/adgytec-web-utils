# Errors

Exports from `src/errors`.

These helper classes and functions serve as the bridge between runtime exceptions (e.g., failed fetches, native `Error` instances, custom exceptions) and structured, schema-validated API error payloads.

---

## `BaseError`

A standard base class for all custom errors thrown directly by the `adgytec-web-utils` package. Extends the native JavaScript `Error` class.

```ts
import { BaseError } from "adgytec-web-utils";

class MyCustomUtilityError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = "MyCustomUtilityError";
  }
}
```

---

## `ApplicationError`

A structured application error class matching the server-side API error payload design. Extends `BaseError`.

### Constructor Signature

```ts
constructor(code: string, details: object = {})
```

### Public Members

- **`code`** (`string`): The stable string identifier of the error (e.g., `"media-too-large"`).
- **`details`** (`unknown`): The raw error details payload. This object automatically includes `{ code }` mapped alongside the other keys provided in the constructor.
- **`parse()`**: Validates the internal `#details` property against the package-wide Zod `errorSchema`.
  - **Returns**: `ErrorDetails` (typed union of valid shapes) if validation succeeds, or `z.ZodError` if the payload does not match any recognized error schema.

### Example Usage

```ts
import { ApplicationError, mediaCodes } from "adgytec-web-utils";

// 1. Constructing and throwing
throw new ApplicationError(mediaCodes.mediaTooLarge, {
  mediaID: "avatar.png",
  size: 2048576,
  maxSupportedSize: 1048576,
});

// 2. Catching and accessing fields
try {
  // run API or upload code...
} catch (err) {
  if (err instanceof ApplicationError) {
    console.log("Error Code:", err.code); // "media-too-large"
    console.log("Details Payload:", err.details); // { code: "media-too-large", mediaID: "avatar.png", ... }

    // Validate schema compliance
    const result = err.parse();
    if (!(result instanceof Error)) {
      console.log("Strictly parsed media size limit:", result.maxSupportedSize);
    }
  }
}
```

---

## `parseError(err)`

Converts an unknown caught value (e.g., in a `catch (err)` block) into a structured, schema-compliant `ErrorDetails` object.

### Conversion Behavior

1. **Network Failures**: If `err` is a network connectivity issue (detected via the `is-network-error` package), it returns:
   ```ts
   { code: "network-error", debugMessage: string }
   ```
2. **Structured Application Errors**: If `err` is an instance of `ApplicationError`:
   - It runs `err.parse()`.
   - If the parse succeeds, it returns the parsed `ErrorDetails`.
   - If the parse fails (meaning the details payload does not match any schema), it wraps the failure and returns:
     ```ts
     { code: "zod-error", error: ZodError }
     ```
3. **Other Errors**: Any other runtime exception (native `Error`, string, etc.) becomes:
   ```ts
   { code: "unexpected-error", debugMessage: string }
   ```

### Example Usage

```ts
import { parseError } from "adgytec-web-utils";

async function executeAction() {
  try {
    await sendRequest();
  } catch (err) {
    const errorDetails = parseError(err);

    if (errorDetails.code === "network-error") {
      showOfflineWarning();
    } else {
      showErrorMessage(errorDetails.code);
    }
  }
}
```

---

## `normalizeError(parsedResponse)`

Collapses implementation-specific override error codes (defined in `defaultOverrides`) into a stable, generic `unexpected-error` shape:

```ts
{
  code: "unexpected-error",
  debugMessage: JSON.stringify(parsedResponse),
}
```

If the error code is not in `defaultOverrides`, the error details payload is returned as-is.

### Example Usage

```ts
import { parseError, normalizeError } from "adgytec-web-utils";

try {
  await performRequest();
} catch (err) {
  const parsed = parseError(err);

  // Normalize override codes to unexpected-error
  const normalized = normalizeError(parsed);
  console.log("Normalized code:", normalized.code);
}
```
