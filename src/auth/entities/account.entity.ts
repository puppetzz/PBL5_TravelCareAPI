import { Column, Entity, PrimaryColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Account {
  @PrimaryColumn({ length: 10 })
  @ApiProperty()
  id: string;

  @Column({ unique: true, nullable: false })
  @ApiProperty()
  username: string;

  @Column({ nullable: false })
  @ApiProperty()
  passwordHash: string;

  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean;

  @Column({ type: 'timestamp', default: new Date().toISOString() })
  @ApiProperty()
  createAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty()
  updateAt: Date;

  @Column({ nullable: true })
  @ApiProperty()
  refreshTokenHash: string;

  @OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  user: User;
}
