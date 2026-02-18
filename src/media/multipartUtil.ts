import type { MultipartUploadedPartDetails } from "./types";

export class MultipartUtil {
  #id: string;
  #response: MultipartUploadedPartDetails[];
  #parts: Set<number>;
  #totalParts: number;
  #completeURL: string;

  constructor(id: string, completeURL: string, totalParts: number) {
    this.#id = id;
    this.#response = [];
    this.#parts = new Set();
    this.#totalParts = totalParts;
    this.#completeURL = completeURL;
  }

  get id(): string {
    return this.#id;
  }

  get completeURL(): string {
    return this.#completeURL;
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

  get list(): MultipartUploadedPartDetails[] {
    return this.#response;
  }

  get canComplete(): boolean {
    return this.#parts.size === this.#totalParts;
  }

  get totalPartsCount(): number {
    return this.#totalParts;
  }

  get uploadedPartsCount(): number {
    return this.#parts.size;
  }
}
