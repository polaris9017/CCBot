import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_info')
@Unique(['channelId'])
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userId: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  channelId: string;

  @OneToOne(() => User, (user) => user.userInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
