import { ApiProperty } from '@nestjs/swagger';

export class UploadObjectsDto {
  @ApiProperty()
  path: string
}