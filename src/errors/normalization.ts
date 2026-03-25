// ErrorNormalization maps multiple internal/actual error codes
// to a single standardized error code shown to the end user.
//
// code  → the normalized (user-facing) error code
// items → list of original/internal error codes that should be mapped to `code`
export type ErrorNormalization = {
    code: string;
    items: string[];
};
