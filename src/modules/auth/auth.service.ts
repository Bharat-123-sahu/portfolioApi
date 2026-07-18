import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { UserModel } from 'src/@database/user.model';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await UserModel(mongoose.connection).findOne({
        email: loginDto.email,
      });

      if (!user) {
        throw new HttpException('Invalid email.', HttpStatus.NOT_FOUND);
      }

      const isPasswordMatched = this.comparePasswords(
        loginDto.password,
        user.password,
      );

      if (!isPasswordMatched) {
        throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
      }
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        success: true,
        message: 'Login successful.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');

    const hashToCompare = crypto
      .pbkdf2Sync(plainPassword, salt, 10000, 64, 'sha512')
      .toString('hex');

    return hash === hashToCompare;
  }
}
