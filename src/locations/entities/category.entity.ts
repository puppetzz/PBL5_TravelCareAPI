import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Location } from '../../locations/entities/location.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @ManyToMany(() => Location, (location) => location.categories)
  @JoinTable()
  locations: Location[];
}
