import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as WinstonDailyRotation from 'winston-daily-rotate-file';
import { utilities as NestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';

const { timestamp, ms, combine } = winston.format;
const { nestLike } = NestWinstonModuleUtilities.format;

const loggingDirectory = __dirname + '/../../logs';
const isProduction = process.env.NODE_ENV === 'production';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: loggingDirectory + `/%DATE%`,
    filename: `CCBotBackend-${level}.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: combine(
      timestamp({ format: 'isoDateTime' }),
      ms(),
      nestLike('Nest', { colors: false, prettyPrint: true })
    ),
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'silly',
      format: combine(
        timestamp({ format: 'isoDateTime' }),
        ms(),
        nestLike('Nest', {
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
