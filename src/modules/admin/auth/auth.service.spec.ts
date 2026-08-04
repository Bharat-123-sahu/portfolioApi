import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';
import { AuthCryptoService } from './auth-crypto.service';
import { AuthMailService } from './auth-mail.service';
import { AuthRateLimitService } from './auth-rate-limit.service';
import { AuthRepository } from './auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: any;

  beforeEach(async () => {
    process.env.ADMIN_SETUP_TOKEN =
      'Bharat_sahu_123Bharat_sahu_123Bharat_sahu_123';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: AuthRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            createAdminUser: jest.fn(),
            savePasswordOtp: jest.fn(),
            findPasswordOtp: jest.fn(),
            deletePasswordOtp: jest.fn(),
            incrementOtpAttempts: jest.fn(),
            setPasswordResetToken: jest.fn(),
            findUserById: jest.fn(),
            updatePassword: jest.fn(),
            setRefreshToken: jest.fn(),
            clearRefreshToken: jest.fn(),
          },
        },
        {
          provide: AuthCryptoService,
          useValue: {
            hashPassword: jest.fn().mockReturnValue('hashed-password'),
            comparePasswords: jest.fn(),
            generateOtp: jest.fn(),
            generateSecureToken: jest.fn(),
            hashToken: jest.fn((value: string) =>
              crypto.createHash('sha256').update(value).digest('hex'),
            ),
            compareTokens: jest.fn(
              (plainToken: string, hashedToken: string) => {
                const hashedPlain = crypto
                  .createHash('sha256')
                  .update(plainToken)
                  .digest('hex');
                return hashedPlain === hashedToken;
              },
            ),
          },
        },
        {
          provide: AuthMailService,
          useValue: {
            sendPasswordOtp: jest.fn(),
          },
        },
        {
          provide: AuthRateLimitService,
          useValue: {
            assertAllowed: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('accepts the setup token from the request body when the query token is missing', async () => {
    const token = process.env.ADMIN_SETUP_TOKEN as string;

    authRepository.findUserByEmail.mockResolvedValue(null);
    authRepository.createAdminUser.mockResolvedValue({
      _id: 'user-1',
      email: 'admin@example.com',
      role: 'admin',
    } as any);

    await expect(
      service.setupAdmin(
        {
          email: 'admin@example.com',
          password: 'StrongAdmin@123',
          confirmPassword: 'StrongAdmin@123',
          token,
        } as never,
        undefined,
      ),
    ).resolves.toMatchObject({
      success: true,
      message: 'Admin account created successfully.',
    });
  });
});
