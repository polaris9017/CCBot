import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting) private readonly settingRepository: Repository<Setting>,
    private readonly dataSource: DataSource
  ) {}

  async createSetting(createSettingDto: CreateSettingDto) {
    const { uid } = createSettingDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingSetting = await this.settingRepository.findOne({ where: { uid } });

      if (existingSetting) {
        throw new ConflictException({ message: 'fail - Setting already exists' });
      }

      const setting = this.settingRepository.create({ ...createSettingDto });
      await queryRunner.manager.save(setting);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return { status: HttpStatus.CREATED, data: 'success' };
  }

  async findSetting(uid: string) {
    const setting = await this.settingRepository.findOne({ where: { uid: uid } });
    if (!setting)
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        data: 'fail - Setting not found',
      });

    return setting;
  }

  async updateSetting(uid: string, updateSettingDto: UpdateSettingDto) {
    const setting = await this.settingRepository.findOne({ where: { uid } });
    if (!setting) throw new NotFoundException('fail - User not found');

    const updatedSetting = this.settingRepository.merge(setting, updateSettingDto);
    await this.settingRepository.save(updatedSetting);
  }
}
