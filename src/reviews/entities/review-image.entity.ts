import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class ReviewImage {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @Column()
  imageKey: string;

  @ManyToOne(() => Review, (review) => review.reviewImages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  review: Review;
}
