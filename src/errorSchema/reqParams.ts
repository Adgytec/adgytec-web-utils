import z from "zod";
import { reqParamsCodes } from "../errorCodes";

export const invalidIDSchema = z.object({
    code: z.literal(reqParamsCodes.invalidID),
    key: z.string(),
});
