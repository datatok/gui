import { DownloadResults } from 'src/utils/DownloadResult';

export interface StorageDriver {
  status(): Promise<any>;

  listObjects(
    argPrefix: string,
  ): Promise<
    { name: string; type: string; size?: number; editDate?: string }[]
  >;

  downloadObject(key: string): Promise<DownloadResults>;
}
