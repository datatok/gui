import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Request,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { basename } from 'path';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { DownloadKeyDto } from './dto/download-key.dto';
import { GetStorageDriverPipe } from './get-storage-driver.pipe';

@ApiTags('bucket')
@Controller('api/download')
export class BucketDownloadController {
  @Get(':bucket/object')
  async downloadKey(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Query() downloadKey: DownloadKeyDto,
    @Response({ passthrough: true }) httpResponse,
  ) {
    const stream = await storage.downloadObject(downloadKey.key);

    console.log(stream.getContentLength());

    httpResponse.set({
      'Content-Disposition': `attachment; filename="${basename(
        downloadKey.key,
      )}"`,
      'Content-Length': stream.getContentLength(),
      'Content-Type': stream.getContentType(),
      Pragma: 'public',
      Expires: 0,
      'Cache-Control': 'must-revalidate, post-check=0, pre-check=0',
    });

    //const stream = createReadStream(join(process.cwd(), 'package.json'));
    //let count = 0;

    /*const stream = new Stream.Readable({
      read(size) {
        return 'ok';
      },
    });

    stream.setEncoding('utf-8');

    setTimeout(() => {
      stream.push('toto');
      stream.push(null);
    }, 1000);*/

    return new StreamableFile(stream);
  }
}
