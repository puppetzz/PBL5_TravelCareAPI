import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;
}
