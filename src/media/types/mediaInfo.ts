export type MediaInfo = {
    id: string;
    name: string;
    size: number;
    file: File;
};

export type NewMediaInfo = (item: File) => MediaInfo;

export type NewMediaInfos = (items: File[]) => MediaInfo[];
