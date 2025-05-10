import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/api/user/user.service';
import { AccessTokenPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET_KEY') as string,
    });
  }

  async validate(payload: Payload) {
    const { uid } = payload;
    const user = await this.userService.findUserByUID(uid);

    if (!user) {
      throw new UnauthorizedException({ message: 'fail - User not found' });
    }

    return user;
  }
}

export type Payload = AccessTokenPayload;
