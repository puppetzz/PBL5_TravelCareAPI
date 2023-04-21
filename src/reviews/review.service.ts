import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Location } from 'src/locations/entities/location.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
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

  async createReview(): Promise<Review> {
    return;
  }
}
