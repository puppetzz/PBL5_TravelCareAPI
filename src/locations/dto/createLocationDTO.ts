import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiFile } from '../api-file.decorator';

export class CreateLocationDTO {
  @ApiProperty()
  name?: string;

  @ApiPropertyOptional()
  about?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isHotel: string;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  hotelClass?: number;

  @ApiPropertyOptional()
  propertyAmenities?: string;

  @ApiPropertyOptional()
  hotelStyleIds?: string;

  @ApiProperty()
  countryId?: string;

  @ApiProperty()
  provinceId?: string;

  @ApiProperty()
  districtId?: string;

  @ApiProperty()
  wardId?: string;

  @ApiProperty()
  streetAddress?: string;

  @ApiProperty({})
  categories?: string;

  @ApiFile({ isArray: true })
  @ApiPropertyOptional()
  images?: Express.Multer.File[];
}
