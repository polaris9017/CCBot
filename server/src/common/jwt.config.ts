import { ConfigService } from '@nestjs/config';

export const JwtConfig = (configService: ConfigService) => {
  return {
    secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
    signOptions: {
      expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    },
  };
};
