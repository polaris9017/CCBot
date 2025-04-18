import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './strategy/NaverStrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/common/jwt.config';
import { ConfigService } from '@nestjs/config';
import { NaverAuthGuard } from './guard/naver.auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => JwtConfig(configService),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, NaverStrategy, NaverAuthGuard],
})
export class AuthModule {}
