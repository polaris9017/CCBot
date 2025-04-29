import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RedisRepository } from 'src/common/redis/redis.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/common/jwt.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => JwtConfig(configService),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [ChatGateway, RedisRepository],
})
export class ChatModule {}
