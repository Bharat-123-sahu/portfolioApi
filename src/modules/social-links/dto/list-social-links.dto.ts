import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class ListSocialLinkDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;
}