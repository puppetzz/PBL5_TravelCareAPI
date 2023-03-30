import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewImage } from './entities/review-image.entity';
import { Review } from './entities/review.entity';
import { TripType } from './entities/trip-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewImage, TripType])],
})
export class ReviewModule {}
