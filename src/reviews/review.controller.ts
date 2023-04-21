import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('review')
@ApiTags('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/get-reviews-by-location/:locationId')
  @ApiOkResponse({ type: Review, isArray: true })
  @ApiParam({ name: 'locationId', type: String, required: true })
  getReviewByLocation(
    @Param('locationId', new ParseUUIDPipe()) locationId: string,
  ): Promise<Review[]> {
    return this.reviewService.getReviewByLocation(locationId);
  }

  @Get('/get-review-by-user/:userId')
  @ApiOkResponse({ type: Review, isArray: true })
  @ApiParam({ name: 'userId', type: String, required: true })
  getReviewByUser(@Param('userId') userId: string): Promise<Review[]> {
    return this.reviewService.getReviewByUser(userId);
  }
}
