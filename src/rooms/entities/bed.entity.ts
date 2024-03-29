import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomBed } from './room-bed.entity';

@Entity()
export class Bed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  icon: string;

  @OneToMany(() => RoomBed, (roomBed) => roomBed.bed)
  roomBeds: RoomBed[];
}
