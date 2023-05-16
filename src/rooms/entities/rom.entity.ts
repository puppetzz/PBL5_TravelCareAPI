import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discount } from './discount.entity';
import { RoomFeature } from './room-feature.entity';
import { RoomType } from './room-type.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false, type: 'int' })
  numberOfRooms: number;

  @Column({ nullable: false, type: 'int', default: 0 })
  avaliableRooms: number;

  @Column({ nullable: false, type: 'int' })
  sleeps: number;

  @Column({ nullable: false, default: false })
  isPrepay: boolean;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Hotel;

  @ManyToMany(() => Discount, (discount) => discount.rooms, {
    nullable: true,
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  discounts: Discount[];

  @ManyToMany(() => RoomFeature, (roomFeature) => roomFeature.rooms, {
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  roomFeatures: RoomFeature[];

  @ManyToMany(() => RoomType, (roomType) => roomType.rooms, {
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  roomTypes: RoomType[];

  @ManyToMany(() => Booking, (booking) => booking.rooms)
  booking: Booking[];
}
