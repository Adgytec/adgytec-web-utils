/**
 * Error codes related to route parameters and query identifiers.
 */
export const reqParamsCodes = {
    invalidID: "invalid-id",
} as const;

/**
 * Request parameter error codes subject to default normalization into `unexpected-error`.
 */
export const reqParamsOverrides = [reqParamsCodes.invalidID] as const;
