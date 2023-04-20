import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomBed } from './room-bed.entity';

@Entity()
export class Bed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: string;

  @OneToMany(() => RoomBed, (roomBed) => roomBed.bed)
  roomBeds: RoomBed[];
}
