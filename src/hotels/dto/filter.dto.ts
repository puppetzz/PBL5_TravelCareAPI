import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @ApiProperty({ required: false })
  search: string;

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

  @IsOptional()
  @ApiProperty({ required: false })
  page: number;

  @IsOptional()
  @ApiProperty({ required: false })
  limit: number;
}
