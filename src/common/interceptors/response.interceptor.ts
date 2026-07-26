import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    return next.handle().pipe(map((data) => this.formatResponse(data)));
  }

  private formatResponse(data: T): ApiResponse<T> | T {
    if (this.isStandardResponse(data)) {
      return data;
    }

    if (this.hasSuccessFlag(data)) {
      const { success, message, ...responseData } = data as Record<
        string,
        unknown
      >;

      return {
        success: Boolean(success),
        message: message ? String(message) : 'Request successful.',
        data: responseData,
        ...(data as Record<string, unknown>),
      } as T;
    }

    return {
      success: true,
      message: 'Request successful.',
      data,
    };
  }

  private isStandardResponse(data: T): data is T {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      'message' in data &&
      'data' in data
    );
  }

  private hasSuccessFlag(data: T): data is T {
    return typeof data === 'object' && data !== null && 'success' in data;
  }
}
