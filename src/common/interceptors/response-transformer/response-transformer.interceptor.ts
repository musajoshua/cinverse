import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../interface/ApiResponse.interface';
import { Request } from 'express';

@Injectable()
export class ResponseTransformerInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now().toString();

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        data,
        meta: {
          requestId: request.requestId,
          timestamp: now,
        },
      })),
    );
  }
}
