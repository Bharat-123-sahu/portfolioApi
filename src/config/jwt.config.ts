import { JwtModuleOptions } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { getJwtSecret } from './env.config';

export const JWT_SECRET = getJwtSecret();
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRE ||
  '7d') as SignOptions['expiresIn'];

export const jwtConfig: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: JWT_EXPIRES_IN,
  },
};
