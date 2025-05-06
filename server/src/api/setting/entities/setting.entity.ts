import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('setting')
@Unique(['uid'])
export class Setting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 8, nullable: false })
  uid: string;

  @Column({ type: 'json', nullable: false })
  settings: object;

  @OneToOne(() => User, (user) => user.setting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uid', referencedColumnName: 'uid' })
  user: User;
}
