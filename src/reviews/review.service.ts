import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { TripType } from './entities/trip-type.entity';
import { ReviewImage } from './entities/review-image.entity';
import { S3Service } from 'src/aws-s3/s3.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(ReviewImage)
    private readonly reviewImageRepository: Repository<ReviewImage>,
    @InjectRepository(TripType)
    private readonly tripTypeRepository: Repository<TripType>,
    private readonly s3Service: S3Service,
  ) {}

  async getReviewByLocation(locationId: string): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({
      where: {
        location: {
          id: locationId,
        },
      },
      relations: {
        user: {
          account: true,
          address: {
            country: true,
            province: true,
            district: true,
            ward: true,
          },
        },
        reviewImages: true,
        tripType: true,
      },
      select: {
        id: true,
        rating: true,
        reviewAt: true,
        updateAt: true,
        tripTime: true,
        title: true,
        content: true,
        user: {
          accountId: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          account: {
            username: true,
          },
          address: {
            id: true,
            streetAddress: true,
          },
        },
      },
    });

    return reviews;
  }

  async getReviewByUser(userId: string): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({
      where: {
        user: {
          accountId: userId,
        },
      },
      relations: {
        user: {
          account: true,
          address: {
            country: true,
            province: true,
            district: true,
            ward: true,
          },
        },
        reviewImages: true,
        tripType: true,
      },
      select: {
        id: true,
        rating: true,
        reviewAt: true,
        updateAt: true,
        tripTime: true,
        title: true,
        content: true,
        user: {
          accountId: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          account: {
            username: true,
          },
          address: {
            id: true,
            streetAddress: true,
          },
        },
      },
    });

    return reviews;
  }

  async getReviewByCurrentUser(user: User): Promise<Review[]> {
    const reviews = await this.getReviewByUser(user.accountId);
    return reviews;
  }

  async getTripType(): Promise<TripType[]> {
    return await this.tripTypeRepository.find();
  }

  async createReview(
    user: User,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const location = await this.locationRepository.findOne({
      where: {
        id: createReviewDto.locationId,
      },
    });

    location.reviewCount += 1;

    await this.locationRepository.save(location);

    if (!location) {
      throw new BadRequestException('Location does not exist!');
    }

    const tripType = await this.tripTypeRepository.findOneBy({
      id: createReviewDto.tripTypeId,
    });
    if (!tripType) {
      throw new BadRequestException('TripType does not exist!');
    }

    const review = this.reviewRepository.create({
      title: createReviewDto.title,
      content: createReviewDto.content,
      rating: createReviewDto.rating,
      tripTime: new Date(createReviewDto.tripTime).toISOString(),
      tripType: tripType,
      user: user,
      location: location,
    });

    await this.reviewRepository.save(review);

    if (createReviewDto.images) {
      for (const image of createReviewDto.images) {
        const { key, url } = await this.s3Service.uploadImage(image);
        console.log(image);
        const reviewImage = this.reviewImageRepository.create({
          review: review,
          imageKey: key,
          imageUrl: url,
        });

        await this.reviewImageRepository.save(reviewImage);
      }
    }

    const newReview = await this.reviewRepository.findOne({
      where: {
        id: review.id,
      },
      relations: {
        user: {
          account: true,
        },
        location: true,
        reviewImages: true,
        tripType: true,
      },
      select: {
        user: {
          account: {
            username: true,
          },
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          profileImageUrl: true,
          coverImageUrl: true,
        },
      },
    });

    return newReview;
  }

  async updateReview(user: User, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({
      where: {
        id: updateReviewDto.reviewId,
      },
      relations: {
        user: true,
        tripType: true,
      },
    });

    if (!review) throw new BadRequestException('Review does not exist');

    if (user.accountId !== review.user.accountId)
      throw new BadRequestException(
        'User must be the review owner to update a review!',
      );

    if (updateReviewDto.tripTypeId) {
      if (updateReviewDto.tripTypeId !== review.tripType.id) {
        const tripType = await this.tripTypeRepository.findOneBy({
          id: updateReviewDto.tripTypeId,
        });

        review.tripType = tripType;
      }
    }

    review.title = updateReviewDto.title;
    review.content = updateReviewDto.content;
    review.rating = updateReviewDto.rating;
    review.tripTime = updateReviewDto.tripTime;
    review.updateAt = new Date();

    if (updateReviewDto.images) {
      for (const image of updateReviewDto.images) {
        const { key, url } = await this.s3Service.uploadImage(image);

        const reviewImage = this.reviewImageRepository.create({
          review: review,
          imageKey: key,
          imageUrl: url,
        });

        await this.reviewImageRepository.save(reviewImage);
      }
    }

    await this.reviewRepository.save(review);

    const updatedReview = await this.reviewRepository.findOne({
      where: {
        id: review.id,
      },
      relations: {
        user: {
          account: true,
        },
        location: true,
        reviewImages: true,
        tripType: true,
      },
      select: {
        user: {
          account: {
            username: true,
          },
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          profileImageUrl: true,
          coverImageUrl: true,
        },
      },
    });

    return updatedReview;
  }

  async deleteReviewImage(user: User, reviewId: string, reviewImageId: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
      relations: {
        user: true,
        reviewImages: true,
      },
    });

    if (!review) {
      throw new BadRequestException('Review does not exist!');
    }

    const reviewImage = await this.reviewImageRepository.findOne({
      where: {
        id: reviewImageId,
      },
    });

    if (!reviewImage)
      throw new BadRequestException('ReviewImage does not exist!');

    if (user.accountId !== review.user.accountId) {
      throw new BadRequestException(
        'User must be the review owner to delete a reviewImage!',
      );
    }

    const deleteResult = await this.reviewImageRepository.delete(
      reviewImage.id,
    );

    if (deleteResult.affected > 0) return 'Deleted successfully!';

    return 'Nothing affected!';
  }

  async deleteReivew(user: User, reviewId: string): Promise<string> {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
      relations: {
        user: true,
      },
    });

    if (!review) {
      throw new BadRequestException('Review does not exist!');
    }

    if (user.role !== 'admin') {
      if (user.accountId !== review.user.accountId) {
        throw new BadRequestException(
          'User must be the review owner to delete a review!',
        );
      }
    }

    const deleteResult = await this.reviewRepository.delete({ id: review.id });
    if (deleteResult?.affected > 0) return 'Deleted successfully!';

    return 'Nothing affected!';
  }
}
