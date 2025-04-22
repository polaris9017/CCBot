import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  validateChzzk(req) {
    const accessToken = req.content.accessToken;
    const refreshToken = req.content.refreshToken;

    return { accessToken, refreshToken };
  }
}
