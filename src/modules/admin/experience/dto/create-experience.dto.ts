import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExperienceDto {
  @ApiProperty({
    example: 'Infosys',
  })
  @IsString()
  companyName: string;

  @ApiProperty({
    example: 'Backend Developer',
  })
  @IsString()
  designation: string;

  @ApiProperty({
    example: 'Full Time',
  })
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiProperty({
    example: 'Indore, India',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: '2025-06-15',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2026-07-31',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  currentlyWorking?: boolean;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiProperty({
    example: 'Developed scalable REST APIs using NestJS and MongoDB.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: ['NestJS', 'MongoDB', 'AWS'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @ApiProperty({
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ApiProperty({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
