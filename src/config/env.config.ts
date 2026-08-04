import { Logger } from '@nestjs/common';
import { config } from 'dotenv';

config();

const logger = new Logger('Environment');
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:4200',
];

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function validateEnvironment(): void {
  const requiredVariables = ['MONGODB_DATABASE'];

  if (isProduction()) {
    requiredVariables.push('JWT_SECRET');
    requiredVariables.push('ADMIN_SETUP_TOKEN');
  }

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(', ')}`,
    );
  }

  if (
    isProduction() &&
    process.env.JWT_SECRET &&
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }

  if (isProduction() && !process.env.CORS_ORIGIN && !process.env.CORS_ORIGINS) {
    throw new Error('CORS_ORIGINS must be configured in production.');
  }

  if (
    process.env.ADMIN_SETUP_TOKEN &&
    process.env.ADMIN_SETUP_TOKEN.length < 32
  ) {
    throw new Error('ADMIN_SETUP_TOKEN must be at least 32 characters.');
  }

  validateNumericEnv('PORT', 1, 65535);
  validateNumericEnv('RATE_LIMIT_WINDOW_MS', 1000);
  validateNumericEnv('RATE_LIMIT_MAX', 1);
  validateNumericEnv('UPLOAD_MAX_FILE_SIZE', 1);

  if (!process.env.JWT_SECRET) {
    logger.warn('JWT_SECRET is not set. Using development fallback secret.');
  }
}

export function getAllowedOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGIN || process.env.CORS_ORIGINS;

  if (!configuredOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  const origins = configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.includes('*')) {
    throw new Error('Wildcard CORS origins are not allowed.');
  }

  return origins;
}

export function getNumberEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);

  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getJwtSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (isProduction()) {
    throw new Error('JWT_SECRET is required in production.');
  }

  return 'portfolio-development-secret-change-me';
}

function validateNumericEnv(
  name: string,
  min: number,
  max = Number.MAX_SAFE_INTEGER,
) {
  const value = process.env[name];

  if (!value) {
    return;
  }

  const numericValue = Number(value);

  if (
    !Number.isFinite(numericValue) ||
    numericValue < min ||
    numericValue > max
  ) {
    throw new Error(`${name} must be a number between ${min} and ${max}.`);
  }
}
