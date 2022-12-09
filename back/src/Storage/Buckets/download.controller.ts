import {
  Controller,
  Get,
  Param,
  Query,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { basename } from 'path';
import { DownloadKeyDto } from './dto/download-key.dto';
import { GetStorageDriverPipe } from './get-storage-driver.pipe';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { DownloadResults } from 'src/utils/DownloadResult';
import { SignedUrlGuard } from 'nestjs-url-generator';

@ApiTags('bucket')
@Controller('api/download')
export class BucketDownloadController {
  @Get(':bucket/object')
  @UseGuards(SignedUrlGuard)
  async downloadKey(
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Query() downloadKey: DownloadKeyDto,
    @Response({ passthrough: true }) httpResponse,
  ) {
    const downloadRecord: DownloadResults = await storage.downloadObject(
      downloadKey.key,
    );

    httpResponse.set({
      'Content-Disposition': `attachment; filename="${basename(
        downloadKey.key,
      )}"`,
      'Content-Length': downloadRecord.contentLength, // stream.getContentLength(),
      'Content-Type': downloadRecord.contentType, // stream.getContentType(),
      Pragma: 'public',
      Expires: 0,
      'Cache-Control': 'must-revalidate, post-check=0, pre-check=0',
    });

    return new StreamableFile(downloadRecord.stream);
  }
}
