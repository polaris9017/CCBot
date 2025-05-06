import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { RedisRepository } from 'src/common/redis/redis.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly redisRepository: RedisRepository
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { naverUid } = loginUserDto;

    const user = await this.userService.findUserByUID(naverUid);

    if (!user) {
      return null;
    }

    return { uid: user.uid };
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
}
