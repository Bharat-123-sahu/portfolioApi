import { JwtModuleOptions } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key';
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRE ||
  '7d') as SignOptions['expiresIn'];

export const jwtConfig: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: JWT_EXPIRES_IN,
  },
};
