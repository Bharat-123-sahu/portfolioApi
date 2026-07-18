import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListHeroDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  perPage?: number = 10;

  @ApiPropertyOptional({
    example: 'Developer',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
