import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './rom.entity';

@Entity()
export class RoomFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Room, (room) => room.roomFeatures)
  rooms: Room[];
}
