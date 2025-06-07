import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/typeorm.config';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ChatModule } from './api/chat/chat.module';
import { SettingModule } from './api/setting/setting.module';
import { WinstonLoggerModule } from './common/logger/winston-logger.module';
import { WinstonLoggerMiddleware } from './common/logger/winston-logger.middleware';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => typeORMConfig(configService),
    }),
    SentryModule.forRoot(),
    AuthModule,
    UserModule,
    SettingModule,
    ChatModule,
    WinstonLoggerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WinstonLoggerMiddleware).forRoutes('*');
  }
}
