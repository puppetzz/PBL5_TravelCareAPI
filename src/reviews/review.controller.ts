import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { ApiConsumes, ApiOkResponse, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from 'src/user/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesToBodyInterceptor } from 'src/locations/api-file.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { TripType } from './entities/trip-type.entity'
import { UpdateReviewDto } from './dto/update-review.dto';

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

  @Get('/get-review-by-current-user/')
  @ApiOkResponse({ type: Review, isArray: true })
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  getReviewbyCurrentUser(@GetCurrentAccount() user: User): Promise<Review[]>{
    return this.reviewService.getReviewByCurrentUser(user);
  }


  @Get('/get-trip-type')
  @ApiOkResponse({ type: TripType, isArray: true})
  getTripType(): Promise<TripType[]> {
    return this.reviewService.getTripType();
  }

  @Post('create-review')
  @ApiOkResponse({ type: Review })
  @ApiConsumes('multipart/form-data')
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('images'), FilesToBodyInterceptor)
  createReview(
    @GetCurrentAccount() user: User,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewService.createReview(user, createReviewDto);
  }

  @Patch('update-review')
  @ApiOkResponse({ type: Review })
  @ApiSecurity('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('images'), FilesToBodyInterceptor)
  updateReview(
    @GetCurrentAccount() user: User,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(user, updateReviewDto);
  }

  @Delete('delete-review-image/:reviewId/:reviewImageId') 
  @ApiOkResponse({ type: Review })
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  deleteReviewImage(
    @GetCurrentAccount() user: User,
    @Param('reviewId', new ParseUUIDPipe()) reviewId: string,
    @Param('reviewImageId',  new ParseUUIDPipe()) reviewImageId: string,
  ) {
    return this.reviewService.deleteReviewImage(user, reviewId, reviewImageId);
  }

  @Delete('delete-review/:reviewId')
  @ApiOkResponse({ type: String })
  @ApiParam({ name: 'reviewId', type: String, required: true})
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  deleteReview(
    @GetCurrentAccount() user: User, 
    @Param('reviewId', new ParseUUIDPipe()) reviewId: string
  ) {
    return this.reviewService.deleteReivew(user, reviewId);
  }
}
