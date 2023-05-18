import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RoomFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Room, (room) => room.roomFeatures)
  rooms: Room[];
}
