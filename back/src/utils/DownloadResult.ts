import { Readable } from 'stream';

export class DownloadResults {
  contentLength: number;
  contentType: string;
  stream: Readable;

  constructor(contentLength: number, contentType: string, stream: Readable) {
    this.contentLength = contentLength;
    this.contentType = contentType;
    this.stream = stream;
  }
}
