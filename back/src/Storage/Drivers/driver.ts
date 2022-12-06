interface StorageDriver {
  status(): Promise<any>;

  listObjects(
    argPrefix: string,
  ): Promise<
    { name: string; type: string; size?: number; editDate?: string }[]
  >;
}
