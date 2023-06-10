import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterRoomDto {
  @IsOptional()
  @ApiProperty({ required: false })
  checkIn: string;

  @IsOptional()
  @ApiProperty({ required: false })
  checkOut: string;

  @IsOptional()
  @ApiProperty({ required: false })
  sleeps: number;

  @IsOptional()
  @ApiProperty({ required: false })
  numberOfRooms: number;
}
