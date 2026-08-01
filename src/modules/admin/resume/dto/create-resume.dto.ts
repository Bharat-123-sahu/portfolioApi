import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResumeDto {

  @ApiProperty({
    example: 'Professional Resume',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '1.0',
  })
  @IsString()
  version: string;

  @ApiProperty({
    example: '/uploads/resumes/resume.pdf',
  })
  @IsString()
  resumeFile: string;

  @ApiProperty({
    example: 'My latest professional resume',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  displayOrder?: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}