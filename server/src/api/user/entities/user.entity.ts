import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserInfo } from './user-info.entity';
import { Setting } from '../../setting/entities/setting.entity';

@Entity('user')
@Unique(['naverUid'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  naverUid: string;

  @Column({ type: 'varchar', length: 8, nullable: false })
  uid: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  userInfo: UserInfo;

  @OneToOne(() => Setting, (setting) => setting.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  setting: Setting;
}
