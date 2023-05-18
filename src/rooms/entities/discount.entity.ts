import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  start: Date;

  @Column({ nullable: false })
  end: Date;

  @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
  discountPercent: number;

  @ManyToMany(() => Room, (room) => room.discounts)
  rooms: Room[];
}
