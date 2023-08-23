import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(LoggingInterceptor.name);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest, getResponse } = context.switchToHttp();
    const res = getResponse();
    const req = getRequest();
    return next.handle().pipe(
      tap((data) =>
        this.logger.debug(
          {
            reqBody: req.body,
            reqHeaders: req.headers,
            resBody: data,
            status: res.statusCode,
            resHeaders: res.headers,
          },
          `${req.method} ${req.url}`,
        ),
      ),
    );
  }
}
