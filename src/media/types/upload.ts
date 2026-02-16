import type { LifecycleHandler } from "./lifecycle";
import type { UploadDetails } from "./uploadDetails";

export type Upload = (
  items: UploadDetails[],
  lifecycleHandler: LifecycleHandler,
) => Promise<void>;
