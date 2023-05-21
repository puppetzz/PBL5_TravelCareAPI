import { Account } from 'src/auth/entities/account.entity';
import { Address } from 'src/address/entities/address.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../locations/entities/location.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Receipt } from 'src/booking/entities/reciept.entity';
import { Exclude } from 'class-transformer';
import { WishList } from 'src/wishlists/wishList.entity';

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

  @Column({ nullable: false })
  @ApiProperty()
  firstName: string;

  @Column({ nullable: false })
  @ApiProperty()
  lastName: string;

  @Column({ unique: true })
  @IsDefined()
  @ApiProperty()
  email: string;

  @Column({ nullable: true })
  @ApiProperty()
  phoneNumber: string;

  @Column({ nullable: true })
  @Exclude()
  profileImage: string;

  @Column({ nullable: true })
  @ApiProperty()
  profileImageUrl: string;

  @Column({ nullable: true })
  @Exclude()
  coverImage: string;

  @Column({ nullable: true })
  @ApiProperty()
  coverImageUrl: string;

  @Column({ nullable: true })
  @ApiProperty()
  about: string;

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

  @OneToMany(() => Review, (review) => review.user, { onUpdate: 'CASCADE' })
  reviews: Review[];

  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking[];

  @OneToMany(() => Receipt, (receipt) => receipt.user)
  receipts: Receipt[];

  @OneToMany(() => WishList, (wishList) => wishList.user)
  wishList: WishList[];
}
