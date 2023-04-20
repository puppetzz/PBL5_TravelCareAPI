import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToMany(() => Hotel, (hotel) => hotel.languages)
  hotels: Hotel[];
}
