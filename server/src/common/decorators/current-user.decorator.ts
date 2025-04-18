import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator((data, ctx) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user;
});
