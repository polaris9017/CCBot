import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'src/common/utils/crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';
import { UserView } from './entities/user-view.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfo) private readonly userInfoRepository: Repository<UserInfo>,
    @InjectRepository(UserView) private readonly userViewRepository: Repository<UserView>,
    private readonly dataSource: DataSource
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { naverUid } = createUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const uid = crypto.generateUserId(naverUid);
      const existingUser = await this.userRepository.existsBy({ uid });
      if (existingUser) {
        throw new ConflictException({ message: 'fail - User already exists' });
      }

      const user = this.userRepository.create({
        uid,
        naverUid: await crypto.encryptValue(naverUid),
      });
      const savedUser = await queryRunner.manager.save(user);

      const userInfo = this.userInfoRepository.create({
        userId: savedUser.id,
      });
      await queryRunner.manager.save(userInfo);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return { uid: crypto.generateUserId(naverUid) };
  }

  async findUserByUID(id: string) {
    const user = await this.userViewRepository.findOne({
      where: {
        uid: id,
      },
    });

    return user;
  }

  async setUserChannelId(uid: string, channelId: string) {
    const user = await this.userRepository.findOne({ where: { uid } });
    if (!user) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }

    await this.userInfoRepository.update({ userId: user.id }, { channelId });
  }

  async updateUser(naverUid: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { naverUid } });
    if (!user) {
      throw new NotFoundException({ message: 'fail - User not found' });
    }
    const userInfo = await this.userInfoRepository.findOne({ where: { userId: user.id } });

    const updatedUserInfo = this.userInfoRepository.merge(userInfo!, updateUserDto);
    await this.userInfoRepository.save(updatedUserInfo);
  }

  async deleteUser(id: string) {
    const findUserById = await this.userRepository.findOne({ where: { naverUid: id } });
    if (!findUserById) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete({ naverUid: id });
  }
}
