import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class ReviewImage {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  image: string;

  @ManyToOne(() => Review, (review) => review.reviewImages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  review: Review;
}
