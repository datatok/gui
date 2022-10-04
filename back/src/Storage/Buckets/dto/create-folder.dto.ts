import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty()
  path: string
}