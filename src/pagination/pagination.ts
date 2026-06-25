export type PageInfo = {
    readonly hasNextPage: boolean;
    readonly nextCursor: string | null;
    readonly hasPrevPage: boolean;
    readonly prevCursor: string | null;
};

export type PageItemWithCursor<T> = {
    readonly cursor: string;
    readonly item: T;
};

export type Page<T> = {
    readonly pageInfo: PageInfo;
    readonly pageItems: readonly PageItemWithCursor<T>[];
};
