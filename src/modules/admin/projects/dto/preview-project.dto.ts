import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class PreviewProjectDto {
  @ApiProperty({
    example: 'https://example.com',
  })
  @IsString()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  url: string;
}
