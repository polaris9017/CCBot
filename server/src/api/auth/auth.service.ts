import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { AccessTokenPayload, RefreshTokenPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async OAuthLogin(req) {
    let type = 'login';

    //회원 조회
    const user = this.userService.findOne(req.user.id);

    // 정보 없을 시 자동가입
    const hashedUID = await this.hashValue(req.user.id);
    if (!user) {
      this.userService.create({
        uid: hashedUID,
      });
      type = 'signup';
    }

    const accessToken = await this.generateAccessToken(req.user.id);
    const refreshToken = await this.generateRefreshToken(req.user.id);

    return { type, accessToken, refreshToken };
  }

  private async hashValue(value: string) {
    const saltRounds = parseInt(this.configService.get<string>('SALT_ROUNDS') ?? '10');
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(value, salt);
  }

  private async generateAccessToken(userId: string): Promise<string> {
    const payload: AccessTokenPayload = {
      id: userId,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const payload: RefreshTokenPayload = {
      id: userId,
    };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }
}
