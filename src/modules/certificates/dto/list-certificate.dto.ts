import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class ListCertificateDto {
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
  isActive?: boolean;
}