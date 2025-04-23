import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async findCurrentUser(@CurrentUser() user: any) {
    return await this.userService.findUserByUID(user.naverUid);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  async deleteUser(@Req() req: Request) {
    await this.userService.deleteUser(req);
  }
}
