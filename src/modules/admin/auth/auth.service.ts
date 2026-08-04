import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { AuthCryptoService } from './auth-crypto.service';
import { AuthMailService } from './auth-mail.service';
import { AuthRateLimitService } from './auth-rate-limit.service';
import { AuthRepository } from './auth.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly genericForgotMessage =
    'If an admin account exists for this email, a password reset OTP has been sent.';
  private readonly genericOtpMessage = 'Invalid or expired verification code.';
  private readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET ||
    `${process.env.JWT_SECRET || 'portfolio-development-secret-change-me'}-refresh`;
  private readonly accessTokenTtl = (process.env.JWT_EXPIRE ||
    '7d') as SignOptions['expiresIn'];
  private readonly refreshTokenTtl = (process.env.JWT_REFRESH_EXPIRE ||
    '30d') as SignOptions['expiresIn'];

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly cryptoService: AuthCryptoService,
    private readonly mailService: AuthMailService,
    private readonly rateLimitService: AuthRateLimitService,
  ) {}

  async setupAdmin(dto: SetupAdminDto, token?: string) {
    const providedToken = (token?.trim() || dto.token?.trim()) ?? '';
    console.log('Setup Admin Token:', providedToken,typeof providedToken);
    this.assertSetupToken(providedToken);

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords must match.');
    }

    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new BadRequestException(
        'An admin account already exists for this email.',
      );
    }

    try {
      const user = await this.authRepository.createAdminUser(
        email,
        this.cryptoService.hashPassword(dto.password),
      );

      return {
        success: true,
        message: 'Admin account created successfully.',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
          },
        },
      };
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new BadRequestException(
          'An admin account already exists for this email.',
        );
      }

      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordMatched = this.cryptoService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const tokens = await this.issueTokens(user);

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
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto, ipAddress: string) {
    const email = this.normalizeEmail(dto.email);

    this.rateLimitService.assertAllowed(
      'forgot-password',
      `${email}:${ipAddress}`,
      5,
      15 * 60 * 1000,
    );

    const user = await this.authRepository.findUserByEmail(email);

    if (!user || !user.isActive) {
      return {
        success: true,
        message: this.genericForgotMessage,
      };
    }

    const otp = this.cryptoService.generateOtp();
    const otpHash = this.cryptoService.hashToken(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.authRepository.savePasswordOtp(email, otpHash, expiresAt);
    await this.mailService.sendPasswordOtp(email, otp);

    return {
      success: true,
      message: this.genericForgotMessage,
    };
  }

  async verifyOtp(dto: VerifyOtpDto, ipAddress: string) {
    const email = this.normalizeEmail(dto.email);

    this.rateLimitService.assertAllowed(
      'verify-otp',
      `${email}:${ipAddress}`,
      10,
      15 * 60 * 1000,
    );

    const [user, otpRecord] = await Promise.all([
      this.authRepository.findUserByEmail(email),
      this.authRepository.findPasswordOtp(email),
    ]);

    if (!user || !otpRecord) {
      throw new BadRequestException(this.genericOtpMessage);
    }

    if (
      otpRecord.attempts >= 5 ||
      otpRecord.expiresAt.getTime() <= Date.now()
    ) {
      await this.authRepository.deletePasswordOtp(email);
      throw new BadRequestException(this.genericOtpMessage);
    }

    if (!this.cryptoService.compareTokens(dto.otp, otpRecord.otp)) {
      await this.authRepository.incrementOtpAttempts(email);
      throw new BadRequestException(this.genericOtpMessage);
    }

    const resetToken = this.cryptoService.generateSecureToken();
    const resetTokenHash = this.cryptoService.hashToken(resetToken);
    const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await Promise.all([
      this.authRepository.deletePasswordOtp(email),
      this.authRepository.setPasswordResetToken(
        user._id,
        resetTokenHash,
        resetTokenExpiresAt,
      ),
    ]);

    return {
      success: true,
      message: 'OTP verified successfully.',
      data: {
        resetToken,
      },
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = this.normalizeEmail(dto.email);
    const user = await this.authRepository.findUserByEmail(email, true);

    if (
      !user ||
      !user.passwordResetTokenHash ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt.getTime() <= Date.now() ||
      !this.cryptoService.compareTokens(
        dto.resetToken,
        user.passwordResetTokenHash,
      )
    ) {
      throw new BadRequestException('Unable to reset password.');
    }

    const passwordHash = this.cryptoService.hashPassword(dto.newPassword);

    await this.authRepository.updatePassword(user._id, passwordHash);

    return {
      success: true,
      message: 'Password reset successfully.',
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Missing or invalid JWT token.');
    }

    const currentMatches = this.cryptoService.comparePasswords(
      dto.currentPassword,
      user.password,
    );

    if (!currentMatches) {
      throw new BadRequestException('Current password is incorrect.');
    }

    if (
      this.cryptoService.comparePasswords(dto.newPassword, user.password) ||
      dto.currentPassword === dto.newPassword
    ) {
      throw new BadRequestException(
        'New password must be different from current password.',
      );
    }

    await this.authRepository.updatePassword(
      user._id,
      this.cryptoService.hashPassword(dto.newPassword),
    );

    return {
      success: true,
      message: 'Password changed successfully.',
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    let payload: { id: string; email: string; role: string };

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const user = await this.authRepository.findUserById(payload.id, true);

    if (
      !user ||
      !user.refreshTokenHash ||
      !user.refreshTokenExpiresAt ||
      user.refreshTokenExpiresAt.getTime() <= Date.now() ||
      !this.cryptoService.compareTokens(dto.refreshToken, user.refreshTokenHash)
    ) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const tokens = await this.issueTokens(user);

    return {
      success: true,
      message: 'Token refreshed successfully.',
      data: tokens,
    };
  }

  async logout(userId: string) {
    await this.authRepository.clearRefreshToken(userId);

    return {
      success: true,
      message: 'Logout successful.',
    };
  }

  comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    return this.cryptoService.comparePasswords(plainPassword, hashedPassword);
  }

  private async issueTokens(user: {
    _id?: unknown;
    email: string;
    role: string;
  }) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.accessTokenTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshTokenTtl,
      }),
    ]);

    await this.authRepository.setRefreshToken(
      user._id,
      this.cryptoService.hashToken(refreshToken),
      new Date(Date.now() + this.getRefreshTokenExpiryMs()),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private getRefreshTokenExpiryMs(): number {
    const days = Number(process.env.JWT_REFRESH_EXPIRE_DAYS || 30);

    return days * 24 * 60 * 60 * 1000;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private assertSetupToken(token?: string): void {
    const expectedToken = process.env.ADMIN_SETUP_TOKEN?.trim();
    const providedToken = token?.trim();
    console.log('Expected Token:', expectedToken,typeof expectedToken);
    console.log('Provided Token:', providedToken,typeof providedToken);
    if (
      !expectedToken ||
      !providedToken ||
      !this.cryptoService.compareTokens(
        providedToken,
        this.cryptoService.hashToken(expectedToken),
      )
    ) {
      throw new ForbiddenException('Invalid admin setup token.');
    }
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
