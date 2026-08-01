import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    example: 'Sagar Institute of Science and Technology',
  })
  @IsString()
  instituteName: string;

  @ApiProperty({
    example: 'Bachelor of Technology',
  })
  @IsString()
  degree: string;

  @ApiProperty({
    example: 'Computer Science Engineering',
  })
  @IsString()
  fieldOfStudy: string;

  @ApiProperty({
    example: 'Sagar, MP',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 2021,
  })
  @IsNumber()
  startYear: number;

  @ApiProperty({
    example: 2025,
  })
  @IsNumber()
  endYear: number;

  @ApiProperty({
    example: '8.2 CGPA',
    required: false,
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({
    example: 'Completed graduation with distinction.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'education/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  instituteLogo?: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}