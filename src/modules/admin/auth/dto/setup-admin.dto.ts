import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SetupAdminDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Admin email address.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Bharat_sahu_123Bharat_sahu_123Bharat_sahu_123',
    description:
      'Optional admin setup token. Used as a fallback when not supplied as a query parameter.',
    required: false,
  })
  @IsString()
  token?: string;

  @ApiProperty({
    example: 'StrongAdmin@123',
    description:
      'Admin password. Must include uppercase, lowercase, number, and special character.',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message:
      'Password must include uppercase, lowercase, number, and special character.',
  })
  password: string;

  @ApiProperty({
    example: 'StrongAdmin@123',
    description: 'Password confirmation.',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
