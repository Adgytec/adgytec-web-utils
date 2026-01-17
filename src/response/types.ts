import { z } from "zod";

export type DecodeAPIResponse = <T>(
  res: Response,
  schema?: z.ZodSchema<T>,
) => Promise<T | null>;
