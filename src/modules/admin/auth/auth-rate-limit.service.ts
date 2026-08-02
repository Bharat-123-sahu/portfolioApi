import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

type RateBucket = {
  count: number;
  resetAt: number;
};

@Injectable()
export class AuthRateLimitService {
  private readonly buckets = new Map<string, RateBucket>();

  assertAllowed(scope: string, key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const bucketKey = `${scope}:${key}`;
    const current = this.buckets.get(bucketKey);

    if (!current || current.resetAt <= now) {
      this.buckets.set(bucketKey, {
        count: 1,
        resetAt: now + windowMs,
      });
      return;
    }

    current.count += 1;

    if (current.count > limit) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
