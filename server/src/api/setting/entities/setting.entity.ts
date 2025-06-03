import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ChatOverlayDesign } from '../types/enum';

@Entity('setting')
@Unique(['uid'])
export class Setting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 8, nullable: false })
  uid: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  activateBot: boolean;

  @Column({ type: 'boolean', default: true, nullable: false })
  activateUptime: boolean;

  @Column({ type: 'boolean', default: true, nullable: false })
  activateMemo: boolean;

  @Column({ type: 'boolean', default: true, nullable: false })
  activateFixedMessage: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  activateCustomCommands: boolean;

  @Column({ type: 'json', nullable: true })
  customCommands?: Record<string, string> | null;

  @Column({ type: 'boolean', default: true, nullable: false })
  activateChatOverlay: boolean;

  @Column({ type: 'enum', default: 'default', enum: ChatOverlayDesign })
  chatOverlayDesign: ChatOverlayDesign;

  @Column({ type: 'boolean', default: false, nullable: false })
  activateChatCustomDesign: boolean;

  @Column({ type: 'text', nullable: true })
  chatCustomDesignCode?: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.setting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uid', referencedColumnName: 'uid' })
  user: User;
}
