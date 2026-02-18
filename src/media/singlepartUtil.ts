export class SinglepartUtil {
  #id: string;
  #blob: Blob;
  #uploadURL: string;
  #completeURL: string;

  constructor(id: string, blob: Blob, uploadURL: string, completeURL: string) {
    this.#id = id;
    this.#blob = blob;
    this.#completeURL = completeURL;
    this.#uploadURL = uploadURL;
  }

  get id(): string {
    return this.#id;
  }

  get blob(): Blob {
    return this.#blob;
  }

  get completeURL(): string {
    return this.#completeURL;
  }

  get uploadURL(): string {
    return this.#uploadURL;
  }
}
