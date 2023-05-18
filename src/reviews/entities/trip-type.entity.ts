import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Review } from './review.entity';

@Entity()
export class TripType {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @OneToMany(() => Review, (review) => review.tripType)
  reviews: Review[];
}
