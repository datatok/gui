import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { basename } from 'path';
import { AuthCurrentUser } from 'src/Security/auth/auth.user.param-decorator';
import { RBACService } from 'src/Security/rbac/rbac.service';
import { AWSStorageDriver } from '../Drivers/aws-driver';
import { StorageBucket } from '../types';
import { DownloadKeyDto } from './dto/download-key.dto';
import { GetBucketPipe } from './get-bucket.pipe';
import { GetStorageDriverPipe } from './get-storage-driver.pipe';
import { SignedUrlGuard } from 'nestjs-url-generator';

@ApiTags('bucket')
@Controller('api/download')
export class BucketDownloadController {
  constructor(private rbacService: RBACService) {}

  @Get(':bucket/object')
  @UseGuards(SignedUrlGuard)
  async downloadKey(
    @AuthCurrentUser() authUser,
    @Param('bucket', GetStorageDriverPipe) storage: AWSStorageDriver,
    @Param('bucket', GetBucketPipe) bucket: StorageBucket,
    @Query() downloadKey: DownloadKeyDto,
    @Response({ passthrough: true }) httpResponse,
  ) {
    if (!this.rbacService.can('download', authUser, bucket, downloadKey.key)) {
      throw new ForbiddenException('cant do this action!');
    }

    const stream = await storage.downloadObject(downloadKey.key);

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
