# 🚀 adgytec-web-utils

`adgytec-web-utils` is a lightweight, high-performance, and framework-agnostic utility library specifically built for modern Adgytec web applications. It serves as the foundation for shared request, response, direct cloud media upload, and form-validation logic.

> [!IMPORTANT]
> This library enforces strict API schema contracts and type safety by utilizing [Zod](https://zod.dev) validators under the hood.

---

## 🛠️ Module Architecture & Documentation

Explore the detailed documentation and code references for each subsystem:

| Module | Purpose | Documentation Link |
| --- | --- | --- |
| **Constants** | Shared API methods, credential modes, S3 limits, and headers. | [constants.md](src/constants/constants.md) |
| **Error Codes** | Standardized, domain-grouped error strings for wire format. | [errorCodes.md](src/errorCodes/errorCodes.md) |
| **Error Schemas** | Zod validation schemas for all server responses and form fields. | [errorSchema.md](src/errorSchema/errorSchema.md) |
| **Errors** | Structured `ApplicationError` classes and parsing pipelines. | [errors.md](src/errors/errors.md) |
| **Forms** | Dotted-key nested form extraction and automatic validation. | [forms.md](src/forms/forms.md) |
| **Media Uploads** | Multi-threaded singlepart & chunked multipart direct cloud uploads. | [media.md](src/media/media.md) |
| **API Response** | Native `fetch` response decoders, validators, and error catchers. | [response.md](src/response/response.md) |

---

## 💎 Design Philosophy

1. **Lightweight & Dependency-Lite**: Built with minimal external dependencies to ensure fast load times and tiny bundle footprint.
2. **Strict Type-Safety**: 100% written in TypeScript. Every response, payload, and field validation matches strict TypeScript types compiled directly from runtime validation definitions.
3. **Developer Ergonomics**: Enforces error consistency. granular errors (e.g. S3 part validation failure) can be resolved directly or safely normalized/collapsed into stable base codes.
4. **Direct Client Uploads**: Upload files directly from user browsers to S3/GCS without routing heavy byte streams through middleman server containers.

---

## 📦 Getting Started

### Installation

```bash
npm install adgytec-web-utils
```

### Basic Example: Response Decoding and Error Parsing

```ts
import { decodeAPIResponse, parseError } from "adgytec-web-utils";
import z from "zod";

// 1. Define expectations
const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
});

// 2. Fetch and Decode safely
async function loadUserData(userId: string) {
  try {
    const res = await fetch(`/api/users/${userId}`);
    const user = await decodeAPIResponse(res, UserSchema);
    console.log("Welcome,", user.username);
  } catch (err) {
    const details = parseError(err);
    console.error(`Error Code: ${details.code}`);
  }
}
```

