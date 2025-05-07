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

@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly userService: UserService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() currentUser: any,
    @Body() createSettingDto: CreateSettingDto,
    @Res() res: Response
  ) {
    const { settings } = createSettingDto;
    const uid = await this.userService.findUserIdByNaverUid(currentUser.naverUid);
    res.json(await this.settingService.createSetting({ uid, settings }));
  }

  @Get()
  @UseGuards(JwtGuard)
  async find(@CurrentUser() currentUser: any, @Res() res: Response) {
    const uid = await this.userService.findUserIdByNaverUid(currentUser.naverUid);
    const setting = await this.settingService.findSetting(uid);

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: setting });
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@CurrentUser() currentUser: any, @Body() updateSettingDto: UpdateSettingDto) {
    const uid = await this.userService.findUserIdByNaverUid(currentUser.naverUid);
    return await this.settingService.updateSetting(uid, updateSettingDto);
  }
}
