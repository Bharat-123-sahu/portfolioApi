import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { PasswordOtpModel } from 'src/@database/password-otp.model';
import { UserModel } from 'src/@database/user.model';

@Injectable()
export class AuthRepository {
  private get users() {
    return UserModel(mongoose.connection);
  }

  private get passwordOtps() {
    return PasswordOtpModel(mongoose.connection);
  }

  findUserByEmail(email: string, includeSecrets = false) {
    const query = this.users.findOne({ email: this.normalizeEmail(email) });

    if (includeSecrets) {
      query.select(
        '+refreshTokenHash +refreshTokenExpiresAt +passwordResetTokenHash +passwordResetExpiresAt',
      );
    }

    return query;
  }

  findUserById(id: string, includeSecrets = false) {
    const query = this.users.findById(id);

    if (includeSecrets) {
      query.select(
        '+refreshTokenHash +refreshTokenExpiresAt +passwordResetTokenHash +passwordResetExpiresAt',
      );
    }

    return query;
  }

  async savePasswordOtp(email: string, otpHash: string, expiresAt: Date) {
    const normalizedEmail = this.normalizeEmail(email);

    await this.passwordOtps.deleteMany({ email: normalizedEmail });

    return this.passwordOtps.create({
      email: normalizedEmail,
      otp: otpHash,
      expiresAt,
      attempts: 0,
      verified: false,
    });
  }

  findPasswordOtp(email: string) {
    return this.passwordOtps.findOne({ email: this.normalizeEmail(email) });
  }

  incrementOtpAttempts(email: string) {
    return this.passwordOtps.updateOne(
      { email: this.normalizeEmail(email) },
      { $inc: { attempts: 1 } },
    );
  }

  deletePasswordOtp(email: string) {
    return this.passwordOtps.deleteMany({ email: this.normalizeEmail(email) });
  }

  setRefreshToken(userId: unknown, tokenHash: string, expiresAt: Date) {
    return this.users.updateOne(
      { _id: userId },
      {
        $set: {
          refreshTokenHash: tokenHash,
          refreshTokenExpiresAt: expiresAt,
        },
      },
    );
  }

  clearRefreshToken(userId: unknown) {
    return this.users.updateOne(
      { _id: userId },
      {
        $unset: {
          refreshTokenHash: '',
          refreshTokenExpiresAt: '',
        },
      },
    );
  }

  setPasswordResetToken(userId: unknown, tokenHash: string, expiresAt: Date) {
    return this.users.updateOne(
      { _id: userId },
      {
        $set: {
          passwordResetTokenHash: tokenHash,
          passwordResetExpiresAt: expiresAt,
        },
      },
    );
  }

  clearPasswordResetToken(userId: unknown) {
    return this.users.updateOne(
      { _id: userId },
      {
        $unset: {
          passwordResetTokenHash: '',
          passwordResetExpiresAt: '',
        },
      },
    );
  }

  updatePassword(userId: unknown, passwordHash: string) {
    return this.users.updateOne(
      { _id: userId },
      {
        $set: { password: passwordHash },
        $unset: {
          passwordResetTokenHash: '',
          passwordResetExpiresAt: '',
          refreshTokenHash: '',
          refreshTokenExpiresAt: '',
        },
      },
    );
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
