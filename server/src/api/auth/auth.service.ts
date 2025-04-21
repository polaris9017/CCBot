import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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

  async naverOAuthLogin(req) {
    //회원 조회
    const user = await this.userService.findUserByUID(req.user.id);

    // 정보 없을 시 자동가입
    if (!user) {
      const uid = this.generateUserId(req.user.id);
      await this.userService.createUser({
        naverUid: req.user.id,
        uid,
      });
    }

    const accessToken = await this.generateAccessToken(req.user.id);
    const refreshToken = await this.generateRefreshToken(req.user.id);

    return { uid: user?.uid ?? this.generateUserId(req.user.id), accessToken, refreshToken };
  }

  chzzkOAuthLogin(req) {
    const accessToken = req.content.accessToken;
    const refreshToken = req.content.refreshToken;

    return { accessToken, refreshToken };
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

    return await this.hashValue(
      await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      })
    );
  }

  private generateUserId(input: string): string {
    // Create a SHA-256 hash and convert to base36 (0-9, a-z)
    const hash = crypto.createHash('sha256').update(input).digest('hex');

    // Convert hex to base62 (a mix of a-z, A-Z, 0-9)
    const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hashedString = '';
    for (let i = 0; i < hash.length; i += 2) {
      const decimal = parseInt(hash.slice(i, i + 2), 16);
      hashedString += base62Chars[decimal % 62];
    }

    return hashedString.slice(0, 8); // Return first 8 characters
  }
}
