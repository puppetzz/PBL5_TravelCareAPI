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
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { RoomImage } from './room-image.entity';
import { RoomBed } from './room-bed.entity';
import { BookingRoom } from 'src/booking/entities/booking-room.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  price: number;

  @Column({ nullable: false, type: 'int' })
  @ApiProperty()
  numberOfRooms: number;

  @Column({ nullable: false, type: 'int', default: 0 })
  @ApiProperty()
  availableRooms: number;

  @Column({ nullable: false, type: 'int' })
  @ApiProperty()
  sleeps: number;

  @Column({ nullable: false, default: false })
  @ApiProperty()
  isPrepay: boolean;

  @Column({ nullable: false, default: false })
  @ApiProperty()
  isFreeCancellation: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  freeCancellationPeriod: number;

  @OneToMany(() => RoomImage, (roomImage) => roomImage.room)
  @ApiProperty()
  roomImages: RoomImage[];

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, {
    onDelete: 'CASCADE',
  })
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

  @OneToMany(() => RoomBed, (roomBed) => roomBed.room, {
    nullable: false,
  })
  roomBeds: RoomBed[];

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.room)
  bookingRooms: BookingRoom[];
}
