export type MediaUploadInfo = {
  id: string;
  name: string;
  size: number;
};

export type NewUploadInfo = (item: File) => MediaUploadInfo;

export type NewUploadInfos = (items: File[]) => MediaUploadInfo[];
