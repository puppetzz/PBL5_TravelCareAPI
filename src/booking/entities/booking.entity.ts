import { ApiProperty } from '@nestjs/swagger';
import { Paypal } from 'src/paypal/entities/paypal.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingRoom } from './booking-room.entity';
import { Receipt } from './reciept.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  checkIn: Date;

  @Column({ nullable: false })
  @ApiProperty()
  checkOut: Date;

  @Column({ nullable: true })
  @ApiProperty()
  CustomerName: string;

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 50.0,
  })
  @ApiProperty()
  cancellationPay: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0.0 })
  refund: number;

  @Column({ nullable: false, default: false })
  @ApiProperty()
  isPaid: boolean;

  @Column({ nullable: false })
  @ApiProperty()
  totalAmount: number;

  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  createAt: Date;

  @Column({ nullable: true })
  @ApiProperty()
  updateAt: Date;

  @Column({ default: false })
  @ApiProperty()
  isSuccess: boolean;

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.booking, {
    onUpdate: 'CASCADE',
  })
  @ApiProperty({ type: () => BookingRoom })
  bookingRooms: BookingRoom[];

  @ManyToOne(() => User, (user) => user.booking)
  @ApiProperty({ type: () => User })
  user: User;

  @OneToOne(() => Receipt, (receipt) => receipt.booking)
  receipt: Receipt;

  @OneToOne(() => Paypal, (paypal) => paypal.booking, {
    nullable: true,
  })
  @JoinColumn()
  paypal: Paypal;
}
