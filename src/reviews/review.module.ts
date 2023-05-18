import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewImage } from './entities/review-image.entity';
import { Review } from './entities/review.entity';
import { TripType } from './entities/trip-type.entity';
import { LocationModule } from 'src/locations/location.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { S3Module } from 'src/aws-s3/s3.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewImage, TripType]),
    LocationModule,
    S3Module,
    AuthModule,
    UserModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
