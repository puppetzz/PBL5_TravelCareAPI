import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Booking } from './booking.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BookingRoom {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  numberOfRooms: number;

  @ManyToOne(() => Room, (room) => room.bookingRooms)
  @ApiProperty({ type: () => Room })
  room: Room;

  @ManyToOne(() => Booking, (booking) => booking.bookingRooms, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  booking: Booking;
}
