import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class TripType {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @OneToOne(() => Review, (review) => review.tripType)
  review: Review;
}
