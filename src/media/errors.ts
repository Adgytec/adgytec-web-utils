import { mediaCodes } from "../errorCodes";
import { ApplicationError } from "../errors";

/**
 * Error thrown when a media file exceeds the maximum allowed file size.
 */
export class MediaTooLargeError extends ApplicationError {
    /**
     * Creates a new MediaTooLargeError instance.
     *
     * @param file - The file that exceeded the maximum size limit.
     * @param maxSize - The maximum supported file size in bytes.
     */
    constructor(file: File, maxSize: number) {
        super(mediaCodes.mediaTooLarge, { file, size: file.size, maxSize });
    }
}
