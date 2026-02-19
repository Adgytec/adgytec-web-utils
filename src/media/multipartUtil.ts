import type { MultipartUploadedPartDetails } from "./types";

export class MultipartUtil {
  #id: string;
  #blob: Blob;
  #response: MultipartUploadedPartDetails[];
  #parts: Set<number>;
  #totalParts: number;
  #completeURL: string;
  #failed: boolean;
  #complete: boolean;

  constructor(id: string, blob: Blob, completeURL: string, totalParts: number) {
    this.#id = id;
    this.#blob = blob;
    this.#response = [];
    this.#parts = new Set();
    this.#totalParts = totalParts;
    this.#completeURL = completeURL;
    this.#failed = false;
    this.#complete = false;
  }

  get failed(): boolean {
    return this.#failed;
  }

  fail() {
    this.#failed = true;
  }

  get id(): string {
    return this.#id;
  }

  get completeURL(): string {
    return this.#completeURL;
  }

  get blob(): Blob {
    return this.#blob;
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
    return this.#response.slice().sort((a, b) => a.partNumber - b.partNumber);
  }

  get canComplete(): boolean {
    return !this.failed && this.#parts.size === this.#totalParts;
  }

  tryStartComplete(): boolean {
    if (this.#complete || !this.canComplete) return false;

    this.#complete = true;
    return true;
  }

  resetComplete() {
    this.#complete = false;
  }

  get totalPartsCount(): number {
    return this.#totalParts;
  }

  get uploadedPartsCount(): number {
    return this.#parts.size;
  }
}
