import type { UploadDetails } from "./uploadDetails";

export type LifecycleHandler = {
  init: (details: UploadDetails[]) => void;
  completed: () => void;
  failed: (id: string, reason: string) => void;
  itemUploaded: (id: string) => void;
  multipartPartUploaded: (
    id: string,
    uploadedPartsCount: number,
    totalPartsCount: number,
  ) => void;
  uploadRetrying: (id: string) => void;
};
