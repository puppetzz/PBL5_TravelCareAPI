import { Column, Entity, PrimaryColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Account {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @Column({ unique: true, nullable: false })
  @ApiProperty()
  username: string;

  @Column({ nullable: false })
  @Exclude()
  passwordHash: string;

  @Column({ nullable: false })
  @Exclude()
  passwordSalt: string;

  @Column({ nullable: false })
  @Exclude()
  iv: string;

  @Column({ default: false })
  @Exclude()
  isVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  createAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  updateAt: Date;

  @Column({ nullable: true })
  @Exclude()
  refreshTokenHash: string;

  @Column({ nullable: true })
  @Exclude()
  refreshTokenSalt: string;

  @OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  user: User;
}
