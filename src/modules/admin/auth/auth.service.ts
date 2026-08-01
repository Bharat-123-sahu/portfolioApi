import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { UserModel } from 'src/@database/user.model';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const user = await UserModel(mongoose.connection)
      .findOne({
        email: loginDto.email,
      })
      .lean();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordMatched = this.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password.');
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
  }

  comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');

    if (!salt || !hash) {
      return false;
    }

    const hashToCompare = crypto
      .pbkdf2Sync(plainPassword, salt, 10000, 64, 'sha512')
      .toString('hex');

    const storedHash = Buffer.from(hash, 'hex');
    const computedHash = Buffer.from(hashToCompare, 'hex');

    return (
      storedHash.length === computedHash.length &&
      crypto.timingSafeEqual(storedHash, computedHash)
    );
  }
}
