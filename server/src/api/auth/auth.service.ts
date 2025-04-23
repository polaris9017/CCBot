import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginUserDto: LoginUserDto) {
    const { naverUid, email } = loginUserDto;

    const user = await this.userService.findUserByUID(naverUid);

    if (!user || user.userInfo.email !== email) {
      throw new UnauthorizedException('fail - User not found');
    }

    return { uid: user.uid };
  }

  validateChzzk(req) {
    const accessToken = req.content.accessToken;
    const refreshToken = req.content.refreshToken;

    return { accessToken, refreshToken };
  }
}
