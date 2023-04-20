import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity()
export class PropertyAmenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Hotel, (hotel) => hotel.propertyAmenities)
  hotels: Hotel[];
}
