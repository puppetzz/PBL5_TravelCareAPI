import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Location is required!' })
  locationId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Title is required!'})
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Rating is required!'})
  rating: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'triptime is required!'})
  tripTime: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'tripType is required!'})
  tripTypeId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  images: Express.Multer.File[];
}
