import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/typeorm.config';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ChatModule } from './api/chat/chat.module';

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
    AuthModule,
    UserModule,
    ChatModule,
  ],
  providers: [],
})
export class AppModule {}
