import { Optional } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

export class BrowseDto {
  @IsString()
  @Matches(/([A-z+-_\/0-9]*)/i)
  @Optional()
  public path?: string;
}
