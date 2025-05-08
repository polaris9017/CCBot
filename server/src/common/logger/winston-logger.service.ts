import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { utilities as NestWinstonModuleUtilities } from 'nest-winston';
import * as WinstonDailyRotation from 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private appName = 'CCBotBackend';
  private readonly logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    const loggindDirectory = __dirname + '/../../logs';
    const { timestamp, ms, combine } = winston.format;
    const { nestLike } = NestWinstonModuleUtilities.format;

    const dailyOptions = (level: string) => {
      return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: loggindDirectory + `/%DATE%`,
        filename: `${this.appName}-${level}.log`,
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: combine(
          timestamp({ format: 'isoDateTime' }),
          ms(),
          nestLike(this.appName, { colors: false, prettyPrint: true })
        ),
      };
    };

    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: isProduction ? 'info' : 'silly',
          format: combine(
            timestamp({ format: 'isoDateTime' }),
            ms(),
            nestLike(this.appName, {
              colors: true,
              prettyPrint: true,
            })
          ),
        }),

        new WinstonDailyRotation(dailyOptions('error')),
        new WinstonDailyRotation(dailyOptions('warn')),
        new WinstonDailyRotation(dailyOptions('info')),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  fatal(message: string, context?: string) {
    this.logger.crit(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
