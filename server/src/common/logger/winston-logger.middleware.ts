import { Injectable, NestMiddleware } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class WinstonLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: WinstonLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const dateString = new Date().toISOString();

    const _url = method + ' ' + originalUrl.split('?')[0];
    const _query = req.query ?? {};
    const _body = req.body ?? {};
    const _headers = req.headers ?? {};

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        JSON.stringify({
          date: dateString,
          clientIp: ip,
          url: _url,
          statusCode: statusCode,

          headers: _headers,
          query: _query,
          body: _body,
        })
      );
    });

    next();
  }
}
