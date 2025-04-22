import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  // Reference: https://begong313.tistory.com/37
  @Get('login/chzzk')
  async loginWithChzzk(@Req() req: Request, @Res() res: Response) {
    const authorizationURL = 'https://chzzk.naver.com/account-interlock';
    const callbackURL = `${this.configService.get<string>('HOST')}/auth/login/chzzk/callback`;
    const clientId = this.configService.get<string>('CHZZK_CLIENT_ID');
    const state = req.query.id;

    res.redirect(
      `${authorizationURL}?clientId=${clientId}&redirectUri=${callbackURL}&state=${state}`
    );
  }

  @Get('login/chzzk/callback')
  async chzzkLoginCallback(@Req() req: Request, @Res() res: Response) {
    const { code, state } = req.query;

    const tokenResponse = await axios.post('https://openapi.chzzk.naver.com/auth/v1/token', {
      grantType: 'authorization_code',
      clientId: this.configService.get<string>('CHZZK_CLIENT_ID'),
      clientSecret: this.configService.get<string>('CHZZK_CLIENT_SECRET'),
      code,
      state,
    });
    const { accessToken, refreshToken } = this.authService.validateChzzk(tokenResponse.data);

    res.json({ access_token: accessToken, refresh_token: refreshToken });
  }
}
