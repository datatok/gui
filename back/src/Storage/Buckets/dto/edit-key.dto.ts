import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class EditKeyDTO {
  @ApiProperty()
  @IsString()
  @Matches(/([A-z+-_\/0-9]*)/i)
  sourceKey: string

  @ApiProperty()
  @IsString()
  @Matches(/([A-z+-_\/0-9]*)/i)
  targetKey: string
}