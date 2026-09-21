import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: () => void) {
    const requestId = req.header('x-request-id') ?? randomUUID();

    const httpMethod = req.method;
    const url = req.url;
    const userId = req.user?.id;

    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    this.logger.log(
      `[${httpMethod}-${url}-${requestId}]: ${userId ?? 'Anonymous User'}`,
    );

    next();
  }
}
