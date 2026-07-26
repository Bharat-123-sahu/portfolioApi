import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    this.logger.debug(
      `JWT guard checking ${request.method} ${request.originalUrl ?? request.url}`,
    );

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
    if (err) {
      throw err;
    }

    if (!user) {
      const message =
        info?.name === 'TokenExpiredError'
          ? 'JWT token has expired.'
          : 'Missing or invalid JWT token.';

      throw new UnauthorizedException(message);
    }

    return user;
  }
}
