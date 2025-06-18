import axios from 'axios';
import * as crypto from 'src/common/utils/crypto';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { RedisRepository } from 'src/common/redis/redis.repository';
import { AccessTokenPayload, RefreshTokenPayload } from './auth.interface';
import { UserView } from '../user/entities/user-view.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SettingService } from '../setting/setting.service';
import { AuthResponse, ChannelInfoResponse, UserInfoResponse } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly settingService: SettingService,
    private readonly redisRepository: RedisRepository
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { naverUid } = loginUserDto;
    const uid = crypto.generateUserId(naverUid);

    let user = await this.userService.findUserByUID(uid);
    if (!(await crypto.verifyValue(naverUid, user?.naverUid!))) {
      throw new UnauthorizedException({ message: 'fail - Invalid user credentials' });
    }

    if (!user) {
      await this.userService.createUser(loginUserDto as CreateUserDto);
      user = await this.userService.findUserByUID(uid);
      await this.settingService.createSetting({ uid: uid });
    }

    const accessToken = await this.generateAccessToken(user!);
    const refreshToken = await this.generateRefreshToken(user!.uid);

    await this.redisRepository.set(
      `refreshToken:${user!.uid}`,
      await crypto.encryptValue(refreshToken),
      60 * 60 * 24 * 30
    );

    return { ...user, accessToken, refreshToken };
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
      const isValidToken = await crypto.verifyValue(refreshToken, storedRefreshToken!);
      if (!isValidToken) throw new UnauthorizedException();

      const newAccessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user.uid);

      await this.redisRepository.set(
        `refreshToken:${user.uid}`,
        await crypto.encryptValue(newRefreshToken),
        60 * 60 * 24 * 30
      );

      return { newAccessToken, newRefreshToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async validateChzzk(userId: string, req: AuthResponse) {
    const { accessToken, refreshToken } = req.content!;

    const profileResponse = await axios.get(
      `${this.configService.get<string>('CHZZK_API_URL')}/open/v1/users/me`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { channelId } = (profileResponse.data as UserInfoResponse).content!;
    const channelInfoResponse = await axios.get(
      `${this.configService.get<string>('CHZZK_API_URL')}/open/v1/channels`,
      {
        params: { channelIds: channelId },
        headers: {
          'Client-Id': process.env.CHZZK_CLIENT_ID,
          'Client-Secret': process.env.CHZZK_CLIENT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    const { channelName, channelImageUrl } = (channelInfoResponse.data as ChannelInfoResponse)
      .content!.data[0]; // 프론트와 달리 배열 처리해야 정상 작동
    const naverUid = (await this.userService.findUserByUID(userId))?.naverUid;
    await this.userService.updateUser(naverUid!, {
      channelId,
      channelName,
      channelImageUrl: channelImageUrl ?? '',
    });

    await this.redisRepository.set(`accessToken/chzzk:${userId}`, accessToken, 60 * 60 * 24);
    await this.redisRepository.set(`refreshToken/chzzk:${userId}`, refreshToken, 60 * 60 * 24 * 30);
  }

  private async generateAccessToken(user: UserView): Promise<string> {
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
}
