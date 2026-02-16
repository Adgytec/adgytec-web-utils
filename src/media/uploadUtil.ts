import type { LifecycleHandler, UploadDetails } from "./types";

export class Upload {
  readonly items: UploadDetails[];
  readonly lifecycleHandler: LifecycleHandler;

  constructor(uploadItems: UploadDetails[], handler: LifecycleHandler) {
    this.items = uploadItems;
    this.lifecycleHandler = handler;
  }

  async init() {
    this.lifecycleHandler.init(this.items);
  }
}
