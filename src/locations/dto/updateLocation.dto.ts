import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiFile } from '../api-file.decorator';

export class UpdateLocationDto {
  @ApiPropertyOptional()
  name: string;
  @ApiPropertyOptional()
  about: string;
  @ApiPropertyOptional()
  description: string;
  @ApiPropertyOptional()
  isHotel: boolean;
  @ApiPropertyOptional()
  countryId: string;
  @ApiPropertyOptional()
  provinceId: string;
  @ApiPropertyOptional()
  districtId: string;
  @ApiPropertyOptional()
  wardId: string;
  @ApiPropertyOptional()
  streetAddress: string;
  @ApiPropertyOptional()
  categories: string;
  @ApiPropertyOptional()
  currentImages: string;
  @ApiFile({ isArray: true })
  @ApiPropertyOptional()
  images: Express.Multer.File[];
}
