import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponse } from '../user/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.authService.login(loginUserDto);

    res.json({ ...user });
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new UnauthorizedException({ message: 'fail - Refresh token is required' });
    }

    const { newAccessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  }

  // Reference: https://begong313.tistory.com/37
  @Get('login/chzzk')
  loginWithChzzk(@Req() req: Request, @Res() res: Response) {
    const authorizationURL = 'https://chzzk.naver.com/account-interlock';
    const callbackURL = `${this.configService.get<string>('HOST')}/auth/login/chzzk/callback`;
    const clientId = this.configService.get<string>('CHZZK_CLIENT_ID');
    const state = Buffer.from(
      JSON.stringify({
        userId: req.query.id as string,
        redirectUrl: req.query.redirectUrl || '',
      })
    ).toString('base64');

    res.redirect(
      `${authorizationURL}?clientId=${clientId}&redirectUri=${callbackURL}&state=${state}`
    );
  }

  @Get('login/chzzk/callback')
  async chzzkLoginCallback(@Req() req: Request, @Res() res: Response) {
    const { code, state } = req.query;
    const { userId, redirectUrl } = JSON.parse(Buffer.from(state as string, 'base64').toString());

    const tokenResponse = await axios.post(
      `${this.configService.get<string>('CHZZK_API_URL')}/auth/v1/token`,
      {
        grantType: 'authorization_code',
        clientId: this.configService.get<string>('CHZZK_CLIENT_ID'),
        clientSecret: this.configService.get<string>('CHZZK_CLIENT_SECRET'),
        code,
        state,
      }
    );
    await this.authService.validateChzzk(userId as string, tokenResponse.data as AuthResponse);

    if (redirectUrl && redirectUrl !== '') {
      res.redirect(redirectUrl as string);
    } else {
      res.json({
        status: HttpStatus.OK,
        message: 'success',
      });
    }
  }
}
