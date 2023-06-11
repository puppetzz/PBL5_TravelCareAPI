import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bed } from './bed.entity';
import { Room } from './room.entity';

@Entity()
export class RoomBed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'int' })
  numberOfBeds: number;

  @ManyToOne(() => Bed, (bed) => bed.roomBeds, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    cascade: true,
  })
  bed: Bed;

  @ManyToOne(() => Room, (room) => room.roomBeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  room: Room;
}
