import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty()
  price?: number;
  @ApiProperty()
  numberOfRooms?: number;
  @ApiProperty()
  avaliableRooms: number;
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
