import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({
    example: 'Latest Resume',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'resume.pdf',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    example: 'uploads/resume.pdf',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({
    example: '2.0',
    required: false,
  })
  @IsOptional()
  @IsString()
  version?: string;

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