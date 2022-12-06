import { Transform, ReadableOptions, Readable } from 'stream';
import { S3 } from '@aws-sdk/client-s3';

type S3DownloadStreamOptions = {
  readonly s3: S3;
  readonly bucket: string;
  readonly key: string;
  readonly rangeSize?: number;
};

const DEFAULT_DOWNLOAD_CHUNK_SIZE = 512 * 1024;

export class S3DownloadStream extends Transform {
  private options: S3DownloadStreamOptions;
  private _currentCursorPosition = 0;
  private _maxContentLength = -1;
  private contentType: string;

  constructor(
    options: S3DownloadStreamOptions,
    nodeReadableStreamOptions?: ReadableOptions,
  ) {
    super(nodeReadableStreamOptions);
    this.options = options;
  }

  getContentLength(): number {
    return this._maxContentLength;
  }

  getContentType(): string {
    return this.contentType;
  }

  async run() {
    const res = await this.options.s3.headObject({
      Bucket: this.options.bucket,
      Key: this.options.key,
    });
    this._maxContentLength = res.ContentLength;
    this.contentType = res.ContentType;
    await this.fetchAndEmitNextRange();
  }

  async fetchAndEmitNextRange() {
    if (this._currentCursorPosition > this._maxContentLength) {
      this.end();
      return;
    }

    // Calculate the range of bytes we want to grab
    const range =
      this._currentCursorPosition +
      (this.options.rangeSize ?? DEFAULT_DOWNLOAD_CHUNK_SIZE);

    // If the range is greater than the total number of bytes in the file
    // We adjust the range to grab the remaining bytes of data
    const adjustedRange =
      range < this._maxContentLength ? range : this._maxContentLength;

    // Set the Range property on our s3 stream parameters
    const rangeParam = `bytes=${this._currentCursorPosition}-${adjustedRange}`;

    // Update the current range beginning for the next go
    this._currentCursorPosition = adjustedRange + 1;

    // Grab the range of bytes from the file
    this.options.s3.getObject(
      { Bucket: this.options.bucket, Key: this.options.key, Range: rangeParam },
      (error, res) => {
        if (error) {
          // If we encounter an error grabbing the bytes
          // We destroy the stream, NodeJS ReadableStream will emit the 'error' event
          this.destroy(error);
          return;
        }

        console.log(
          `fetched range ${this.options.bucket}/${this.options.key} | ${rangeParam}`,
        );

        const data = res.Body;

        if (!(data instanceof Readable)) {
          // never encountered this error, but you never know
          this.destroy(new Error(`unsupported data representation: ${data}`));
          return;
        }

        data.pipe(this, { end: false });

        let streamClosed = false;

        data.on('end', async () => {
          console.log(`end`);
          if (streamClosed) {
            return;
          }
          streamClosed = true;
          await this.fetchAndEmitNextRange();
        });
      },
    );
  }

  _transform(chunk, _, callback) {
    callback(null, chunk);
  }
}
