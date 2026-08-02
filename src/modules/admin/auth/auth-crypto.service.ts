import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthCryptoService {
  hashPassword(plainPassword: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(plainPassword, salt, 10000, 64, 'sha512')
      .toString('hex');

    return `${salt}:${hash}`;
  }

  comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');

    if (!salt || !hash) {
      return false;
    }

    const hashToCompare = crypto
      .pbkdf2Sync(plainPassword, salt, 10000, 64, 'sha512')
      .toString('hex');

    return this.timingSafeEqual(hash, hashToCompare);
  }

  generateOtp(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }

  generateSecureToken(): string {
    return crypto.randomBytes(48).toString('base64url');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  compareTokens(plainToken: string, hashedToken: string): boolean {
    return this.timingSafeEqual(this.hashToken(plainToken), hashedToken);
  }

  private timingSafeEqual(expectedHex: string, actualHex: string): boolean {
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = Buffer.from(actualHex, 'hex');

    return (
      expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
    );
  }
}
