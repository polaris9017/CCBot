import { forwardRef, Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), forwardRef(() => UserModule)],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
