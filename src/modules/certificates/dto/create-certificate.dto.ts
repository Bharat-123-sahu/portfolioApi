import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  issuer: string;

  @IsOptional()
  // @IsDateString()
  issueDate: string;

  @IsOptional()
  // @IsDateString()

  expiryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  credentialId?: string;

  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @IsOptional()
  @IsString()
  certificateImage?: string;

  @IsOptional()
  @IsString()
  certificateFile?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}