import z from "zod";

const MultipartPartUploadSchema = z.object({
  presignPut: z.url(),
  partNumber: z.int().positive().lte(10000),
  partSzie: z.int().positive().gt(0),
});

const MultipartSchema = z.object({
  mediaID: z.uuidv7(),
  uploadType: z.literal("multipart"),
  multipartPresignPart: z.array(MultipartPartUploadSchema).nonempty(),
  multipartSuccessCallback: z.url(),
});

const SinglepartSchema = z.object({
  mediaID: z.uuidv7(),
  uploadType: z.literal("singlepart"),
  presignPut: z.url(),
  singlepartSuccessCallback: z.url(),
});

export const UploadDetailsAPIResSchema = z.discriminatedUnion("uploadType", [
  MultipartSchema,
  SinglepartSchema,
]);

export type UploadDetailsAPIRes = z.infer<typeof UploadDetailsAPIResSchema>;
