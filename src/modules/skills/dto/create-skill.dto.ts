import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    example: 'Node.js',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'node-js',
  })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({
    example: 'Backend',
  })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({
    example: 'https://example.com/node.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    example: 90,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  percentage!: number;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
