import { Account } from 'src/auth/entities/account.entity';
import { Address } from 'src/address/entities/address.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../locations/entities/location.entity';

@Entity()
export class User {
  @PrimaryColumn()
  @ApiProperty()
  accountId: string;

  @OneToOne(() => Account, (account) => account.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  @ApiProperty()
  account: Account;

  @Column({ nullable: true })
  @ApiProperty()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  lastName: string;

  @Column({ unique: true })
  @IsDefined()
  @ApiProperty()
  email: string;

  @Column({ nullable: true })
  @ApiProperty()
  phoneNumber: string;

  @Column({ default: 'user' })
  @ApiProperty()
  role: string;

  @Column({ default: false })
  @ApiProperty()
  isSale: boolean;

  @OneToOne(() => Address, (address) => address.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  @ApiProperty({ type: () => Address })
  address: Address;

  @OneToMany(() => Location, (location) => location.user, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  locations: Location[];
}
