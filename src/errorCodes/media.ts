import type { ErrorNormalization } from "../errors";

export const mediaCodes = {
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

export const mediaOverrides: ErrorNormalization = {
    code: "media-upload-error",
    items: [
        mediaCodes.invalidMultipartNumber,
        mediaCodes.uploadAlreadyCompleted,
        mediaCodes.unsupportedObjectUploaded,
        mediaCodes.completeMultipartUploadCalledTooSoon,
        mediaCodes.singlepartUploadFailed,
        mediaCodes.multipartPartUploadFailed,
        mediaCodes.missingETagValue,
    ],
} as const;
