import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Location } from '../../locations/entities/location.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Location, (location) => location.categories)
  @JoinTable()
  locations: Location[];
}
