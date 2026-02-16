import { v7 as uuidv7 } from "uuid";
import type { NewMediaInfos, NewMediaInfo } from "./types";

export const newMediaInfo: NewMediaInfo = (item) => {
  return {
    id: uuidv7(),
    name: item.name,
    size: item.size,
    file: item,
  };
};

export const newMediaInfos: NewMediaInfos = (items) => {
  return items.map(newMediaInfo);
};
