# Forms

Exports from `src/forms`.

The form helper facilitates client-side browser form validation: you pass an `HTMLFormElement` and a Zod validation schema, and the helper extracts, parses, and validates the inputs, returning either the typed data object or a flat map of field errors.

> [!NOTE]
> **Flat Schema Assumption**: `validateAndGetFormValues` is optimized for flat forms (single-level objects). It assumes the `FormData` inputs and the Zod schema are flat. If you need to validate deep nested structures, use the recursive `flattenFieldNodes` utility directly on a custom `FieldNode[]` error tree.

---

## Tutorial: Building and Validating a Nested Form

This tutorial walks through building a form with nested inputs (such as user details and a profile object), binding a submit handler, validating the inputs, and displaying the validation errors.

### 1. Define the HTML Form

Use standard naming conventions. To represent nested objects, use dotted naming structures for the `name` attribute of the fields.

```html
<form id="registration-form">
  <!-- Top-level field -->
  <div>
    <label>Username</label>
    <input type="text" name="username" required />
    <span id="error-username" class="error-msg"></span>
  </div>

  <!-- Nested field -->
  <div>
    <label>Email Address</label>
    <input type="email" name="email" required />
    <span id="error-email" class="error-msg"></span>
  </div>

  <!-- Profile nested object fields -->
  <div>
    <label>Age</label>
    <input type="number" name="age" required />
    <span id="error-age" class="error-msg"></span>
  </div>

  <button type="submit">Register</button>
</form>
```

### 2. Write the Submission and Validation Script

Import `validateAndGetFormValues` and your Zod schema. Bind to the `submit` event of the form, run validation, and display field errors.

```ts
import { validateAndGetFormValues } from "adgytec-web-utils";
import z from "zod";

// Define the validation rules using Zod
const registrationSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  age: z.coerce.number().min(18),
});

const formEl = document.getElementById("registration-form") as HTMLFormElement;

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  // Clear existing errors in the UI
  document.querySelectorAll(".error-msg").forEach(span => span.textContent = "");

  // Extract values and validate
  const result = validateAndGetFormValues(formEl, registrationSchema);

  if (result.success) {
    // result.data is type-safe: { username: string; email: string; age: number }
    console.log("Form successfully validated! Data:", result.data);
    submitDataToServer(result.data);
  } else {
    // result.errors is a FlattenedErrors record: Record<string, FormFieldError[]>
    console.warn("Validation failed:", result.errors);
    
    // Display error messages using the dotted keys
    if (result.errors.username) {
      document.getElementById("error-username")!.textContent = "Username must be at least 3 characters.";
    }
    if (result.errors.email) {
      document.getElementById("error-email")!.textContent = "Please enter a valid email address.";
    }
    if (result.errors.age) {
      document.getElementById("error-age")!.textContent = "You must be at least 18 years old.";
    }
  }
});
```

---

## `validateAndGetFormValues(formElement, schema)`

Extracts the data from an HTML form, validates it against a Zod schema, and returns a discriminated union result.

- **`success: true`**: Contains parsed and validated `data` type-cast to `z.infer<T>`.
- **`success: false`**: Contains a `FlattenedErrors` object with all errors keyed by their dotted field paths.

---

## `flattenFieldNodes(nodes, parentKey?)`

Recursively processes a nested `FieldNode[]` array and converts it into a flat, single-level record of errors keyed by dotted paths.

### Dotted Key Behavior

When the validation tree has multiple levels of nesting, path segments are joined with `.` in the order they appear in the schema.

### Input and Output Example

#### Input (`FieldNode[]`):

```ts
const fieldNodes = [
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
            key: "address",
            errors: [
              { type: "missing" }
            ]
          }
        ]
      }
    ]
  }
];
```

#### Output (`FlattenedErrors`):

```ts
const flattened = flattenFieldNodes(fieldNodes);
/*
{
  "user.email": [
    { type: "invalid", details: { cause: "invalid-email" } }
  ],
  "user.profile.address": [
    { type: "missing" }
  ]
}
*/
```

---

## Type Definitions

### `ValidateAndGetFormValues`

Function signature for the form validation helper.

```ts
export type ValidateAndGetFormValues = <T extends z.ZodTypeAny>(
  formElement: HTMLFormElement,
  schema: T
) => FormValidateResult<z.infer<T>>;
```

### `FlattenedErrors`

Flat key-value record maps dotted field strings to arrays of `FormFieldError`.

```ts
export type FlattenedErrors = Record<string, FormFieldError[]>;
```

