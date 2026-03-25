import type { ErrorNormalization } from "../errors";
import { authOverrides, signedURLOverrides } from "./auth";
import { commonOverrides } from "./common";
import { iamOverrides } from "./iam";
import { mediaOverrides } from "./media";
import { paginationOverrides } from "./pagination";
import { reqBodyOverrides } from "./reqBody";
import { serverOverrides } from "./server";

export const defaultOverrides: readonly ErrorNormalization[] = [
    authOverrides,
    signedURLOverrides,
    commonOverrides,
    iamOverrides,
    mediaOverrides,
    paginationOverrides,
    reqBodyOverrides,
    serverOverrides,
] as const;
