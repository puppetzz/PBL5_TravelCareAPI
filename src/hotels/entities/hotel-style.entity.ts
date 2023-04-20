import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity()
export class HotelStyle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Hotel, (hotel) => hotel.hotelStyles)
  hotels: Hotel[];
}
