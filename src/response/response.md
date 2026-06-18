# API Response Handling

Exports from `src/response`.

The response helper serves as the core boundary between the browser's raw native `fetch` client and this package's structured application error handling systems. It processes responses, validates shapes, handles errors, and returns type-safe objects.

---

## `decodeAPIResponse(res, schema?)`

Decodes a native HTTP `Response` object returned by `fetch`.

### Behavior & Parsing Stages

1. **Empty / Successful Response**: If no `schema` is provided and the response status is `ok` (status code 200–299), it immediately resolves to `null`.
2. **Text Reader Check**: Attempts to read the raw text of the response body. If the reader fails, it throws an `ApplicationError` with code `malformed-response-body`.
3. **Content-Type Validation**: If a body is present, the helper verifies that the header `Content-Type` matches `application/json`. If it does not, it throws `invalid-response-shape`.
4. **JSON Parser Check**: Parse the raw body as JSON. If parsing fails, it throws `malformed-json-from-server`.
5. **Success Payload Validation**:
   - If the response status is `ok` and a Zod `schema` is provided, it validates the JSON payload.
   - If validation succeeds, it returns the parsed object typed to `T`.
   - If validation fails, it throws an `ApplicationError` with code `invalid-response-shape` containing details about the Zod schema failure.
6. **Error Payload Validation**:
   - If the response status is NOT `ok`, it attempts to decode the JSON error payload.
   - If the payload contains a `{ code }` field, it throws an `ApplicationError(code, payload)`.
   - If it does not contain a code and the status is >= 500, it throws `internal-server-error`.
   - Otherwise, it throws `unknown-server-error`.

---

## Function Overload Signatures

The helper utilizes TypeScript function overloading to provide correct return types based on whether a Zod schema validator was supplied.

```ts
// Signature 1: When schema is provided, returns Promise of verified data type T
export function decodeAPIResponse<T>(
  res: Response,
  schema: z.ZodSchema<T>
): Promise<T>;

// Signature 2: When no schema is provided, returns Promise resolving to null
export function decodeAPIResponse(
  res: Response
): Promise<null>;
```

---

## Complete, End-to-End Examples

### 1. Fetching and Decoding with Schema Validation

```ts
import { decodeAPIResponse } from "adgytec-web-utils";
import z from "zod";

// Define the expected response shape
const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string(),
  createdAt: z.coerce.date(),
});

type UserProfile = z.infer<typeof userProfileSchema>;

async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    // Decodes response and verifies it matches the schema shape
    const profile = await decodeAPIResponse(response, userProfileSchema);
    
    console.log("Successfully loaded user:", profile.displayName);
    return profile;
  } catch (error) {
    // If response was not ok, or schema failed, decodeAPIResponse throws ApplicationError
    console.error("Failed to decode user profile:", error.code);
    return null;
  }
}
```

### 2. Making a Action Call (No Expected Response Body)

For requests like `DELETE` or `PUT` that return empty success statuses (like `204 No Content`), omit the schema argument.

```ts
import { decodeAPIResponse } from "adgytec-web-utils";

async function deleteUser(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    // Resolves to null if response.ok is true
    await decodeAPIResponse(response);
    return true;
  } catch (error) {
    console.error("Deletion failed:", error.code);
    return false;
  }
}
```

