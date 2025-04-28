import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserInfo } from './entities/user-info.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfo) private readonly userInfoRepository: Repository<UserInfo>,
    private readonly dataSource: DataSource
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { naverUid } = createUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingUser = await this.userRepository.existsBy({ naverUid });
      if (existingUser) {
        throw new ConflictException({ message: 'fail - User already exists' });
      }

      const user = this.userRepository.create({ naverUid, uid: this.generateUserId(naverUid) });
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

    return { uid: this.generateUserId(naverUid) };
  }

  async findUserByUID(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        naverUid: id,
      },
      relations: ['userInfo'],
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async deleteUser(id: string) {
    const findUserById = await this.userRepository.findOne({ where: { naverUid: id } });
    if (!findUserById) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete({ naverUid: id });
  }

  private generateUserId(input: string): string {
    // Create a SHA-256 hash and convert to base36 (0-9, a-z)
    const hash = crypto.createHash('sha256').update(input).digest('hex');

    // Convert hex to base62 (a mix of a-z, A-Z, 0-9)
    const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hashedString = '';
    for (let i = 0; i < hash.length; i += 2) {
      const decimal = parseInt(hash.slice(i, i + 2), 16);
      hashedString += base62Chars[decimal % 62];
    }

    return hashedString.slice(0, 8); // Return first 8 characters
  }
}
