import { BaseError } from "../errors";
import type { NewUploadDetails, NewUploadsDetails } from "./types";

export const newUploadDetails: NewUploadDetails = (mediaInfo, apiResponse) => {
  if (mediaInfo.id !== apiResponse.mediaID) {
    throw new BaseError("media item and response id mismatch");
  }

  return {
    ...apiResponse,
    file: mediaInfo.file,
    size: mediaInfo.size,
  };
};

export const newUploadsDetails: NewUploadsDetails = (
  mediaInfos,
  apiResponses,
) => {
  if (mediaInfos.length !== apiResponses.length) {
    throw new BaseError(
      `items mismatch: mediaInfos=${mediaInfos.length}, apiResponses=${apiResponses.length}`,
    );
  }

  // ids are uuidv7
  const sortedInfos = [...mediaInfos].sort((a, b) => a.id.localeCompare(b.id));

  // ids are uuidv7
  const sortedResponses = [...apiResponses].sort((a, b) =>
    a.mediaID.localeCompare(b.mediaID),
  );

  return sortedInfos.map((mediaInfo, index) =>
    newUploadDetails(mediaInfo, sortedResponses[index]),
  );
};
