import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoomDto {
  @ApiProperty()
  price?: number;
  @ApiProperty()
  numberOfRooms?: number;
  @ApiProperty()
  availableRooms: number;
  @ApiProperty()
  sleeps?: number;
  @ApiProperty()
  isPrepay?: boolean;
  @ApiPropertyOptional()
  discountIds?: string[];
  @ApiPropertyOptional()
  roomFeatureIds?: string[];
  @ApiPropertyOptional()
  roomTypeIds?: string[];
}
