import { Column, Entity, PrimaryColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Account {
  @PrimaryColumn({ length: 10 })
  @ApiProperty()
  id: string;

  @Column({ unique: true, nullable: false })
  @ApiProperty()
  username: string;

  @Column({ nullable: false })
  @Exclude()
  passwordHash: string;

  @Column({ default: false })
  @Exclude()
  isVerified: boolean;

  @Column({ type: 'timestamp', default: new Date().toISOString() })
  @ApiProperty()
  createAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  updateAt: Date;

  @Column({ nullable: true })
  @Exclude()
  refreshTokenHash: string;

  @OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  user: User;
}
