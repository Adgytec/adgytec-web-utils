import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
    httpMethods,
    httpReqHeaders,
    MediaItemsLimit,
    MediaUploadLimit,
} from "../src/constants";
import { mediaCodes } from "../src/errorCodes";
import { ApplicationError, BaseError } from "../src/errors";
import {
    newMediaInfo,
    newMediaInfos,
    newUploadDetails,
    newUploadsDetails,
    toUploadPayload,
    toUploadPayloads,
    uploadItem,
    uploadItems,
} from "../src/media";
import { MultipartUtil } from "../src/media/multipartUtil";
import { SinglepartUtil } from "../src/media/singlepartUtil";
import type {
    LifecycleHandler,
    UploadDetails,
    UploadDetailsAPIRes,
} from "../src/media/types";

const originalFetch = globalThis.fetch;

afterEach(() => {
    globalThis.fetch = originalFetch;
});

const makeFile = (name: string, size: number) =>
    ({
        name,
        size,
    }) as File;

test("newMediaInfo creates upload-ready media info and rejects oversized files", () => {
    const file = makeFile("avatar.png", 128);
    const mediaInfo = newMediaInfo(file);

    assert.equal(mediaInfo.name, file.name);
    assert.equal(mediaInfo.size, file.size);
    assert.equal(mediaInfo.file, file);
    assert.match(mediaInfo.id, /^[0-9a-f-]{36}$/);

    assert.throws(
        () => newMediaInfo(makeFile("video.mp4", MediaUploadLimit + 1)),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);

            const applicationError = error as ApplicationError;
            assert.equal(applicationError.code, mediaCodes.mediaTooLarge);
            assert.deepEqual(applicationError.details, {
                code: mediaCodes.mediaTooLarge,
                mediaID: "video.mp4",
                currentSize: MediaUploadLimit + 1,
                maxSupportedSize: MediaUploadLimit,
            });

            return true;
        }
    );
});

test("newMediaInfos rejects item lists above the configured media item limit", () => {
    const files = Array.from({ length: MediaItemsLimit + 1 }, (_, index) =>
        makeFile(`file-${index}.txt`, index)
    );

    assert.throws(
        () => newMediaInfos(files),
        (error) => {
            assert.equal(error instanceof ApplicationError, true);

            const applicationError = error as ApplicationError;
            assert.equal(
                applicationError.code,
                mediaCodes.mediaItemsLimitExceeded
            );
            assert.deepEqual(applicationError.details, {
                code: mediaCodes.mediaItemsLimitExceeded,
                currentLength: MediaItemsLimit + 1,
                maxItemsSupported: MediaItemsLimit,
            });

            return true;
        }
    );
});

test("toUploadPayload strips file data from media info", () => {
    const mediaInfos = newMediaInfos([
        makeFile("first.jpg", 10),
        makeFile("second.jpg", 20),
    ]);

    assert.deepEqual(toUploadPayload(mediaInfos[0]), {
        id: mediaInfos[0].id,
        name: "first.jpg",
        size: 10,
    });
    assert.deepEqual(toUploadPayloads(mediaInfos), [
        {
            id: mediaInfos[0].id,
            name: "first.jpg",
            size: 10,
        },
        {
            id: mediaInfos[1].id,
            name: "second.jpg",
            size: 20,
        },
    ]);
});

test("newUploadDetails merges API response data with the original file details", () => {
    const mediaInfo = newMediaInfo(makeFile("asset.jpg", 512));
    const apiResponse = {
        mediaID: mediaInfo.id,
        uploadType: "singlepart",
        presignPut: "https://upload.example.com/put",
        singlepartSuccessCallback: "https://upload.example.com/complete",
    } satisfies UploadDetailsAPIRes;

    assert.deepEqual(newUploadDetails(mediaInfo, apiResponse), {
        ...apiResponse,
        file: mediaInfo.file,
        size: mediaInfo.size,
    });

    assert.throws(
        () =>
            newUploadDetails(mediaInfo, {
                ...apiResponse,
                mediaID: newMediaInfo(makeFile("other.jpg", 1)).id,
            }),
        BaseError
    );
});

test("newUploadsDetails matches API responses to media infos by id", () => {
    const mediaInfos = newMediaInfos([
        makeFile("first.jpg", 10),
        makeFile("second.jpg", 20),
    ]);
    const firstResponse = {
        mediaID: mediaInfos[0].id,
        uploadType: "singlepart",
        presignPut: "https://upload.example.com/first",
        singlepartSuccessCallback: "https://upload.example.com/first/complete",
    } satisfies UploadDetailsAPIRes;
    const secondResponse = {
        mediaID: mediaInfos[1].id,
        uploadType: "multipart",
        multipartPresignPart: [
            {
                presignPut: "https://upload.example.com/second/part-1",
                partNumber: 1,
                partSize: 20,
            },
        ],
        multipartSuccessCallback: "https://upload.example.com/second/complete",
    } satisfies UploadDetailsAPIRes;

    assert.deepEqual(
        newUploadsDetails(mediaInfos, [secondResponse, firstResponse]),
        [
            {
                ...firstResponse,
                file: mediaInfos[0].file,
                size: mediaInfos[0].size,
            },
            {
                ...secondResponse,
                file: mediaInfos[1].file,
                size: mediaInfos[1].size,
            },
        ]
    );

    assert.throws(
        () => newUploadsDetails(mediaInfos, [firstResponse]),
        BaseError
    );
});

test("MultipartUtil tracks unique uploaded parts and completion state", () => {
    const multipartUtil = new MultipartUtil(
        "media-id",
        new Blob(["hello"]),
        "https://upload.example.com/complete",
        2
    );

    assert.equal(multipartUtil.canComplete, false);
    assert.equal(multipartUtil.tryStartComplete(), false);

    multipartUtil.add({ partNumber: 2, etag: "etag-2" });
    multipartUtil.add({ partNumber: 1, etag: "etag-1" });
    multipartUtil.add({ partNumber: 1, etag: "duplicate-etag" });

    assert.equal(multipartUtil.uploadedPartsCount, 2);
    assert.equal(multipartUtil.totalPartsCount, 2);
    assert.equal(multipartUtil.contains(1), true);
    assert.deepEqual(multipartUtil.list, [
        { partNumber: 1, etag: "etag-1" },
        { partNumber: 2, etag: "etag-2" },
    ]);
    assert.equal(multipartUtil.canComplete, true);
    assert.equal(multipartUtil.tryStartComplete(), true);
    assert.equal(multipartUtil.tryStartComplete(), false);

    multipartUtil.resetComplete();
    assert.equal(multipartUtil.tryStartComplete(), true);

    multipartUtil.fail();
    assert.equal(multipartUtil.failed, true);
    assert.equal(multipartUtil.canComplete, false);
});

test("SinglepartUtil exposes upload metadata and completion readiness", () => {
    const blob = new Blob(["hello"]);
    const singlepartUtil = new SinglepartUtil(
        "media-id",
        blob,
        "https://upload.example.com/put",
        "https://upload.example.com/complete"
    );

    assert.equal(singlepartUtil.id, "media-id");
    assert.equal(singlepartUtil.blob, blob);
    assert.equal(singlepartUtil.uploadURL, "https://upload.example.com/put");
    assert.equal(
        singlepartUtil.completeURL,
        "https://upload.example.com/complete"
    );
    assert.equal(singlepartUtil.canComplete, false);

    singlepartUtil.allowComplete();

    assert.equal(singlepartUtil.canComplete, true);
});

test("uploadItem uploads and completes a singlepart item", async () => {
    const calls: Array<{
        input: RequestInfo | URL;
        init?: RequestInit;
    }> = [];
    globalThis.fetch = (async (input, init) => {
        calls.push({ input, init });
        return new Response(null, {
            status: 200,
        });
    }) as typeof fetch;

    const file = new File(["hello"], "hello.txt");
    const item: UploadDetails = {
        mediaID: "0198a0e9-903c-7d4f-8246-317022e6523b",
        uploadType: "singlepart",
        presignPut: "https://upload.example.com/put",
        singlepartSuccessCallback: "https://upload.example.com/complete",
        file,
        size: file.size,
    };
    const events: string[] = [];
    const handler: LifecycleHandler = {
        init: (details) => {
            events.push(`init:${details.length}`);
        },
        completed: () => {
            events.push("completed");
        },
        failed: (id) => {
            events.push(`failed:${id}`);
        },
        itemUploaded: (id) => {
            events.push(`uploaded:${id}`);
        },
        multipartPartUploaded: () => {
            events.push("multipart-part-uploaded");
        },
        uploadRetrying: (id) => {
            events.push(`retrying:${id}`);
        },
        multipartPartUploadRetrying: () => {
            events.push("multipart-retrying");
        },
    };

    await uploadItem(item, handler, { concurrentUploads: 1, retryLimit: 0 });

    assert.deepEqual(events, [
        "init:1",
        `uploaded:${item.mediaID}`,
        "completed",
    ]);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].input, item.presignPut);
    assert.equal(calls[0].init?.method, httpMethods.put);
    assert.equal(calls[0].init?.body, file);
    assert.equal(calls[1].input, item.singlepartSuccessCallback);
    assert.equal(calls[1].init?.method, httpMethods.post);
});

test("uploadItems uploads multipart parts and sends sorted completion payload", async () => {
    const calls: Array<{
        input: RequestInfo | URL;
        init?: RequestInit;
    }> = [];
    globalThis.fetch = (async (input, init) => {
        calls.push({ input, init });

        if (String(input).includes("part-")) {
            const partNumber = Number(String(input).at(-1));
            return new Response(null, {
                status: 200,
                headers: {
                    ETag: `etag-${partNumber}`,
                },
            });
        }

        return new Response(null, {
            status: 200,
        });
    }) as typeof fetch;

    const file = new File(["abcdefghij"], "multi.txt");
    const item: UploadDetails = {
        mediaID: "0198a0e9-903c-7d4f-8246-317022e6523b",
        uploadType: "multipart",
        multipartPresignPart: [
            {
                presignPut: "https://upload.example.com/part-2",
                partNumber: 2,
                partSize: 5,
            },
            {
                presignPut: "https://upload.example.com/part-1",
                partNumber: 1,
                partSize: 5,
            },
        ],
        multipartSuccessCallback: "https://upload.example.com/complete",
        file,
        size: file.size,
    };
    const events: string[] = [];
    const handler: LifecycleHandler = {
        init: (details) => {
            events.push(`init:${details.length}`);
        },
        completed: () => {
            events.push("completed");
        },
        failed: (id) => {
            events.push(`failed:${id}`);
        },
        itemUploaded: (id) => {
            events.push(`uploaded:${id}`);
        },
        multipartPartUploaded: (id, uploadedParts, totalParts) => {
            events.push(`part:${id}:${uploadedParts}/${totalParts}`);
        },
        uploadRetrying: (id) => {
            events.push(`retrying:${id}`);
        },
        multipartPartUploadRetrying: (id, partNumber) => {
            events.push(`multipart-retrying:${id}:${partNumber}`);
        },
    };

    await uploadItems([item], handler, { concurrentUploads: 1, retryLimit: 0 });

    assert.deepEqual(events, [
        "init:1",
        `part:${item.mediaID}:1/2`,
        `part:${item.mediaID}:2/2`,
        `uploaded:${item.mediaID}`,
        "completed",
    ]);
    assert.equal(calls.length, 3);
    assert.equal(calls[0].input, "https://upload.example.com/part-2");
    assert.equal(calls[1].input, "https://upload.example.com/part-1");
    assert.equal(calls[2].input, item.multipartSuccessCallback);
    assert.equal(calls[2].init?.method, httpMethods.post);
    assert.deepEqual(JSON.parse(String(calls[2].init?.body)), {
        partsInfo: [
            {
                partNumber: 1,
                etag: "etag-1",
            },
            {
                partNumber: 2,
                etag: "etag-2",
            },
        ],
    });
    assert.equal(
        (calls[2].init?.headers as Record<string, string>)[
            httpReqHeaders.contentType.key
        ],
        httpReqHeaders.contentType.valueApplicationJSON
    );
});
