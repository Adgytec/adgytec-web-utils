import type { ErrorNormalization } from "../errors";
import { mediaOverrides } from "./media";
import { middlewareOverrides } from "./middleware";
import { miscOverrides } from "./misc";
import { payloadOverrides } from "./payload";
import { reqParamsOverrides } from "./reqParams";

export const defaultOverrides = [
    mediaOverrides,
    payloadOverrides,
    miscOverrides,
    reqParamsOverrides,
    middlewareOverrides,
] as const satisfies readonly ErrorNormalization[];

export type DefaultOverrideCode =
    (typeof defaultOverrides)[number]["items"][number];
