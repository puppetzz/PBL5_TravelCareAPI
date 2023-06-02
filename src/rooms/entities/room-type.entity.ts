import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Room, (room) => room.roomTypes)
  rooms: Room[];
}
