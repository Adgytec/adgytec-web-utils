import type { MultipartUploadedPartDetails } from "./types";

export class MultipartUtil {
  #response: MultipartUploadedPartDetails[];
  #parts: Set<number>;
  #totalParts: number;

  constructor(totalParts: number) {
    this.#response = [];
    this.#parts = new Set();
    this.#totalParts = totalParts;
  }

  add(itemRes: MultipartUploadedPartDetails) {
    if (this.contains(itemRes.partNumber)) {
      return;
    }

    this.#response.push(itemRes);
    this.#parts.add(itemRes.partNumber);
  }

  contains(partNumber: number): boolean {
    return this.#parts.has(partNumber);
  }

  list(): MultipartUploadedPartDetails[] {
    return this.#response;
  }

  allPartsUploaded(): boolean {
    return this.#parts.size === this.#totalParts;
  }
}
