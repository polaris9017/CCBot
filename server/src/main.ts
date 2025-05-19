import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { winstonLogger } from './common/logger/winston-logger.internal';
import { WinstonLoggerService } from './common/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  app.useLogger(app.get(WinstonLoggerService));
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>('PORT') as string);
  const origin = configService.get<string>('CORS_ORIGIN');

  app.enableCors({
    origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port);
}

bootstrap();
