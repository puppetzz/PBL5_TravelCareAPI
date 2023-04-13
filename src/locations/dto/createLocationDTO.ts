import { ApiProperty } from '@nestjs/swagger';
import { ApiFile } from '../api-file.decorator';
import { IsUUID } from 'class-validator';

export class CreateLocationDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  about: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isHotel: boolean;
  @ApiProperty()
  countryId: string;
  @ApiProperty()
  provinceId: string;
  @ApiProperty()
  districtId: string;
  @ApiProperty()
  wardId: string;
  @ApiProperty()
  streetAddress: string;
  @ApiProperty({})
  categories: string;
  @ApiFile({ isArray: true })
  images: Express.Multer.File[];
}
