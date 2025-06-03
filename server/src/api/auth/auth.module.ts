import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/common/jwt.config';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtGuard } from './guard/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RedisRepository } from 'src/common/redis/redis.repository';
import { SettingModule } from '../setting/setting.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => JwtConfig(configService),
    }),
    forwardRef(() => UserModule),
    forwardRef(() => SettingModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, JwtStrategy, JwtGuard, RedisRepository],
})
export class AuthModule {}
