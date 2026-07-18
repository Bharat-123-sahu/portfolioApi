import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'portfolio-secret-key',
  signOptions: {
    expiresIn: '1d',
  },
};
