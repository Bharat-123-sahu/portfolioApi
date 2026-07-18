import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAboutDto {
  @ApiProperty({
    example: 'About Me',
  })
  @IsString()
  @IsNotEmpty()
  heading!: string;

  @ApiProperty({
    example: 'Full Stack Developer',
  })
  @IsString()
  @IsNotEmpty()
  subHeading!: string;

  @ApiProperty({
    example: 'I am a Full Stack Developer with experience in MERN and NestJS.',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;

  @ApiProperty({
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalProjects?: number;

  @ApiProperty({
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalClients?: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalCertificates?: number;

  @ApiProperty({
    example: 'https://example.com/resume.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}