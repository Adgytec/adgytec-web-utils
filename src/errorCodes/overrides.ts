import { mediaOverrides } from "./media";
import { middlewareOverrides } from "./middleware";
import { miscOverrides } from "./misc";
import { payloadOverrides } from "./payload";
import { reqParamsOverrides } from "./reqParams";

/**
 * Consolidated list of all error codes that normalize directly to `unexpected-error` by default.
 */
export const defaultOverrides = [
    ...mediaOverrides,
    ...payloadOverrides,
    ...miscOverrides,
    ...reqParamsOverrides,
    ...middlewareOverrides,
] as const;

/**
 * Union of all error codes subject to default normalization.
 */
export type DefaultOverridesCode = (typeof defaultOverrides)[number];
