import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async findCurrentUser(@CurrentUser() user: any) {
    return await this.userService.findUserByUID(user.naverUid);
  }

  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  async setUserChannelId(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.updateUser(user.naverUid, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  async deleteUser(@CurrentUser() user: any) {
    await this.userService.deleteUser(user.naverUid);
  }
}
