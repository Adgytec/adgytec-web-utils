import type { Upload } from "./types";

export const upload: Upload = async (items, handler) => {
  handler.init(items);
};
