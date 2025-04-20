import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { NaverAuthGuard } from './guard/naver.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(NaverAuthGuard)
  async login() {
    return;
  }

  @Get('login/callback')
  @UseGuards(NaverAuthGuard)
  async loginCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.OAuthLogin(req);

    res.json({ access_token: accessToken, refresh_token: refreshToken });
  }
}
