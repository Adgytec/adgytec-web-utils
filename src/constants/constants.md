# Constants

Constants exported from `src/constants`.

These constants are designed to be lightweight, stable, and type-safe. They should be imported by request, response, and upload modules instead of duplicating raw strings in application code.

---

## `httpMethods`

Standard HTTP method string constants. Using these prevents typos and enforces consistency when making requests or defining API endpoints.

### Definition

```ts
export const httpMethods = {
  get: "GET",
  post: "POST",
  put: "PUT",
  patch: "PATCH",
  delete: "DELETE",
} as const;
```

### Example Usage

```ts
import { httpMethods } from "adgytec-web-utils";

async function fetchUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`, {
    method: httpMethods.get,
    headers: {
      "Accept": "application/json",
    },
  });
  return response.json();
}
```

| Key | Value | Description |
| --- | --- | --- |
| `get` | `"GET"` | Retrieve data from the server. |
| `post` | `"POST"` | Send new data to the server. |
| `put` | `"PUT"` | Replace existing data on the server. |
| `patch` | `"PATCH"` | Apply partial modifications to a resource. |
| `delete` | `"DELETE"` | Delete a resource from the server. |

---

## `httpRequestCredentials`

Constants representing the credential mode (`RequestCredentials`) for cross-origin and same-origin fetch requests.

### Definition

```ts
export const httpRequestCredentials: Record<string, RequestCredentials> = {
  include: "include",
  sameOrigin: "same-origin",
  omit: "omit",
} as const;
```

### Example Usage

```ts
import { httpRequestCredentials } from "adgytec-web-utils";

// Make a request that includes cookies even for cross-origin requests
const response = await fetch("https://api.example.com/data", {
  credentials: httpRequestCredentials.include,
});
```

| Key | Value | Description |
| --- | --- | --- |
| `include` | `"include"` | Always send credentials (cookies, basic auth headers) even for cross-origin requests. |
| `sameOrigin` | `"same-origin"` | Only send credentials for requests to the same origin. |
| `omit` | `"omit"` | Never send credentials with the request. |

---

## `httpReqHeaders`

Structured HTTP request headers and standard values.

### Definition

```ts
export const httpReqHeaders = {
  contentType: {
    key: "Content-Type",
    valueApplicationJSON: "application/json",
  },
  authorization: {
    key: "Authorization",
    schemeBearer: "Bearer",
    schemeBasic: "Basic",
  },
  userLocale: {
    key: "x-user-locale",
  },
} as const;
```

### Example Usage

```ts
import { httpReqHeaders } from "adgytec-web-utils";

const token = "ey...";

const response = await fetch("/api/protected-resource", {
  method: "POST",
  headers: {
    [httpReqHeaders.contentType.key]: httpReqHeaders.contentType.valueApplicationJSON,
    [httpReqHeaders.authorization.key]: `${httpReqHeaders.authorization.schemeBearer} ${token}`,
    [httpReqHeaders.userLocale.key]: "en-US",
  },
  body: JSON.stringify({ active: true }),
});
```

| Header Key / Value | String Value | Description |
| --- | --- | --- |
| `contentType.key` | `"Content-Type"` | Header specifying the media type of the resource. |
| `contentType.valueApplicationJSON` | `"application/json"` | Value indicating the payload is JSON formatted. |
| `authorization.key` | `"Authorization"` | Header credentials for authenticating a client. |
| `authorization.schemeBearer` | `"Bearer"` | Token authentication scheme prefix. |
| `authorization.schemeBasic` | `"Basic"` | Username/password authentication scheme prefix. |
| `userLocale.key` | `"x-user-locale"` | Custom header indicating client's preferred language/locale. |

---

## `MediaItemsLimit`

The maximum number of files accepted by the multi-file validation helper `newMediaInfos`. Use this to enforce maximum batch sizes in UI/UX upload dropzones before starting request lifecycles.

- **Value**: `100`

### Example Usage

```ts
import { MediaItemsLimit } from "adgytec-web-utils";

function handleFileSelect(files: File[]) {
  if (files.length > MediaItemsLimit) {
    alert(`You cannot upload more than ${MediaItemsLimit} files at once.`);
    return;
  }
  // Proceed with uploading
}
```

---

## `MediaUploadLimit`

The maximum supported upload size in bytes for a single media item.

- **Value**: `104,857,600,000` bytes (10,000 chunks × 10 MiB, approximately 97.6 GiB or 104.8 GB).

### Example Usage

```ts
import { MediaUploadLimit } from "adgytec-web-utils";

function validateFile(file: File): boolean {
  if (file.size > MediaUploadLimit) {
    console.error(`File is too large. Max size allowed is ${MediaUploadLimit} bytes.`);
    return false;
  }
  return true;
}
```

