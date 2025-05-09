import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/api/user/user.service';

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

  async validate(payload: any) {
    const { id } = payload.user;
    const user = await this.userService.findUserByNaverUid(id);

    if (!user) {
      throw new UnauthorizedException({ message: 'fail - User not found' });
    }

    return user;
  }
}

export interface Payload {
  user?: {
    id: string;
  };
}
