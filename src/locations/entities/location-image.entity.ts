import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from './location.entity';

@Entity()
export class LocationImage {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  imageKey: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Location, (location) => location.locationImages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  location: Location;
}
