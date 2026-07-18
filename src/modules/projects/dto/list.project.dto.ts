import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListProjectDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  perPage?: number;

  @ApiPropertyOptional({
    example: 'Portfolio',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
