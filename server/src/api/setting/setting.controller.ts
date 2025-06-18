import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { JwtGuard } from '../auth/guard/jwt.guard';
import * as crypto from 'src/common/utils/crypto';

@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly userService: UserService
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() currentUser: any,
    @Body() createSettingDto: CreateSettingDto,
    @Res() res: Response
  ) {
    const { settings } = createSettingDto;
    const uid = crypto.generateUserId(currentUser.naverUid);
    const user = await this.userService.findUserByUID(uid);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: 'fail - User not found',
      });
    }
    res.json(await this.settingService.createSetting({ uid, settings }));
  }

  @Get()
  @UseGuards(JwtGuard)
  async find(@CurrentUser() currentUser: any, @Res() res: Response) {
    const uid = crypto.generateUserId(currentUser.naverUid);
    const setting = await this.settingService.findSetting(uid);

    if (!setting) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: 'fail - Setting not found',
      });
    }
    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: setting });
  }

  @Patch()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@CurrentUser() currentUser: any, @Body() updateSettingDto: UpdateSettingDto) {
    const uid = crypto.generateUserId(currentUser.naverUid);
    return await this.settingService.updateSetting(uid, updateSettingDto);
  }
}
