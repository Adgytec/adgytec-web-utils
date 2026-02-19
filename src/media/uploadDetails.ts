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

  const apiResponseMap = new Map(
    apiResponses.map((response) => [response.mediaID, response]),
  );

  return mediaInfos.map((mediaInfo) => {
    const apiResponse = apiResponseMap.get(mediaInfo.id);
    if (!apiResponse) {
      // This case should not happen if lengths are equal and IDs are unique,
      // but it's good practice to handle it defensively.
      throw new BaseError(
        `Could not find a matching API response for media info with id: ${mediaInfo.id}`,
      );
    }
    return newUploadDetails(mediaInfo, apiResponse);
  });
};
