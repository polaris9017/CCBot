import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { RedisRepository } from 'src/common/redis/redis.repository';
import { AccessTokenPayload, RefreshTokenPayload } from './auth.interface';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly redisRepository: RedisRepository
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { naverUid } = loginUserDto;

    let user = await this.userService.findUserByUID(naverUid);

    if (!user) {
      const { uid } = await this.userService.createUser(loginUserDto);
      user = await this.userService.findUserByUID(uid);
    }

    const accessToken = await this.generateAccessToken(user!);
    const refreshToken = await this.generateRefreshToken(user!.uid);

    await this.redisRepository.set(
      `refreshToken:${user!.uid}`,
      await this.encryptValue(refreshToken),
      60 * 60 * 24 * 30
    );

    return { uid: user!.uid, userInfo: user!.userInfo, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const secretKey = this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: secretKey,
      });

      const user = await this.userService.findUserByUID(payload.uid);
      if (!user) throw new UnauthorizedException();

      const storedRefreshToken = await this.redisRepository.get(`refreshToken:${user.uid}`);
      const isValidToken = await this.verifyValue(refreshToken, storedRefreshToken!);
      if (!isValidToken) throw new UnauthorizedException();

      const newAccessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user.uid);

      await this.redisRepository.set(
        `refreshToken:${user.uid}`,
        await this.encryptValue(newRefreshToken),
        60 * 60 * 24 * 30
      );

      return { newAccessToken, newRefreshToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async validateChzzk(state, req) {
    const accessToken = req.content.accessToken;
    const refreshToken = req.content.refreshToken;

    const profileResponse = await axios.get('https://openapi.chzzk.naver.com/open/v1/users/me', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    await this.userService.setUserChannelId(state, profileResponse.data.content.channelId);

    await this.redisRepository.set(`accessToken/chzzk:${state}`, accessToken, 60 * 60 * 24);
    await this.redisRepository.set(`refreshToken/chzzk:${state}`, refreshToken, 60 * 60 * 24 * 30);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: AccessTokenPayload = {
      uid: user.uid,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(uid: string): Promise<string> {
    const payload: RefreshTokenPayload = {
      uid: uid,
    };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  private async encryptValue(value: string, rounds: number = 10): Promise<string> {
    const salt = await bcrypt.genSalt(rounds);

    return await bcrypt.hash(value, salt);
  }

  private async verifyValue(value: string, encryptedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, encryptedValue);
  }
}
