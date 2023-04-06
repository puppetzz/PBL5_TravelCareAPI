import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../../locations/entities/location.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @ManyToMany(() => Location, (location) => location.categories)
  @JoinTable()
  locations: Location[];
}
