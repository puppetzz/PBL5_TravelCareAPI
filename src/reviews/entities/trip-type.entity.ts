import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class TripType {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @OneToOne(() => Review, (review) => review.tripType)
  review: Review;
}
