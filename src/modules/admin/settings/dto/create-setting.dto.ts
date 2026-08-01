import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  
} from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  siteTitle: string;

  @IsOptional()
  @IsString()
  siteDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  siteKeywords?: string[];

  @IsOptional()
  @IsString()
  siteAuthor?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  favicon?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  accentColor?: string;

  @IsOptional()
  @IsString()
  defaultProfileImage?: string;

  @IsOptional()
  @IsString()
  defaultResume?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];

  @IsOptional()
  @IsString()
  googleAnalyticsId?: string;

  @IsOptional()
  @IsString()
  googleTagManagerId?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsBoolean()
  enableBlog?: boolean;

  @IsOptional()
  @IsBoolean()
  enableProjects?: boolean;

  @IsOptional()
  @IsBoolean()
  enableContactForm?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}