import { ApiProperty } from '@nestjs/swagger';

export class DeleteKeysDto {
  @ApiProperty()
  keys: string[]
}