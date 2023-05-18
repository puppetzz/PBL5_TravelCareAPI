import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RoomImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageKey: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Room, (room) => room.roomImages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  room: Room;
}
