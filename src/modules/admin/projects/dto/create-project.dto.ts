import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Portfolio Website',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'portfolio-website',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    example: 'Personal portfolio website.',
  })
  @IsString()
  shortDescription: string;

  @ApiProperty({
    example: 'A complete portfolio built using Angular and NestJS.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Web Development',
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: ['Angular', 'NestJS', 'MongoDB'],
  })
  @IsArray()
  technologies: string[];

  @ApiProperty({
    example: 'project/thumbnail.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    example: [
      'project/img1.png',
      'project/img2.png',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({
    example: 'https://github.com/user/project',
    required: false,
  })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({
    example: 'https://project.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  liveDemoUrl?: string;

  @ApiProperty({
    example: 'Example Website',
    required: false,
  })
  @IsOptional()
  @IsString()
  previewTitle?: string;

  @ApiProperty({
    example: 'A short website description.',
    required: false,
  })
  @IsOptional()
  @IsString()
  previewDescription?: string;

  @ApiProperty({
    example: 'https://api.microlink.io/screenshot/example.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  previewImage?: string;

  @ApiProperty({
    example: 'https://example.com/favicon.ico',
    required: false,
  })
  @IsOptional()
  @IsString()
  favicon?: string;

  @ApiProperty({
    example: 'example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({
    example:
      'https://play.google.com/store/apps/details?id=com.app',
    required: false,
  })
  @IsOptional()
  @IsString()
  playStoreUrl?: string;

  @ApiProperty({
    example: 'https://apps.apple.com/app/id123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  appStoreUrl?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

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
