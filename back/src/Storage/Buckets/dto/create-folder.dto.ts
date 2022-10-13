import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty()
  @IsString()
  @Matches(/([A-z+-_\/0-9]*)/i)
  path: string
}