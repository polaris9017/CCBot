import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
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
  async deleteUser(@CurrentUser() user: any) {
    await this.userService.deleteUser(user.naverUid);
  }
}
