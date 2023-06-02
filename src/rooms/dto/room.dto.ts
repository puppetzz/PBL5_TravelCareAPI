import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { isArray } from 'class-validator';

export class RoomBed {
  @ApiProperty()
  bedId: string;
  @ApiProperty()
  numberOfBed: number;
}

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
  @ApiPropertyOptional({
    isArray: true,
    type: RoomBed,
  })
  roomBeds?: RoomBed[];
}
