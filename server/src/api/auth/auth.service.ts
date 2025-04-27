import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const { naverUid, email } = loginUserDto;

    const user = await this.userService.findUserByUID(naverUid);

    if (!user || user.userInfo.email !== email) {
      throw new UnauthorizedException('fail - User not found');
    }

    return { uid: user.uid };
  }

  async validateChzzk(state, req) {
    const accessToken = req.content.accessToken;
    const refreshToken = req.content.refreshToken;

    await this.redisRepository.set(`accessToken/chzzk:${state}`, accessToken, 60 * 60 * 24);
    await this.redisRepository.set(`refreshToken/chzzk:${state}`, refreshToken, 60 * 60 * 24 * 30);
  }
}
