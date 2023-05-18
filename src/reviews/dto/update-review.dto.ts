import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateReviewDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ReviewId is required!'})
  reviewId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Title is required!' })
  title: string;
 
  @ApiProperty()
  @IsNotEmpty({ message: 'Content is required!' })
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Rating is required!' })
  rating: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'tripTime is required!' })
  tripTime: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'tripTime is required!' })
  tripTypeId: string;

  @ApiProperty({ 
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false, 
  })
  images: Express.Multer.File[];
}
