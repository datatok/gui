import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class DownloadKeyDto {
  @ApiProperty()
  @IsString()
  @Matches(/([A-z+-_\/0-9]*)/i)
  key: string;
}
