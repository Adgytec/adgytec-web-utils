import type { ErrorNormalization } from "../errors";

export const mediaCodes = {
    mediaUploadError: "media-upload-error",
    invalidMultipartNumber: "invalid-multipart-upload-part-number",
    mediaObjectNotFound: "object-not-found",
    mediaTooLarge: "media-too-large",
    mediaItemsLimitExceeded: "media-items-limit-exceeded",
    uploadAlreadyCompleted: "upload-already-completed",
    unsupportedObjectUploaded: "unsupported-object-uploaded",
    completeMultipartUploadCalledTooSoon:
        "complete-multipart-upload-called-too-soon",

    singlepartUploadFailed: "singlepart-upload-failed",
    multipartPartUploadFailed: "multipart-part-upload-failed",
    missingETagValue: "missing-etag-value",
} as const;

export const mediaOverrides = {
    code: mediaCodes.mediaUploadError,
    items: [
        mediaCodes.invalidMultipartNumber,
        mediaCodes.uploadAlreadyCompleted,
        mediaCodes.unsupportedObjectUploaded,
        mediaCodes.completeMultipartUploadCalledTooSoon,
        mediaCodes.singlepartUploadFailed,
        mediaCodes.multipartPartUploadFailed,
        mediaCodes.missingETagValue,
    ],
} as const satisfies ErrorNormalization;
