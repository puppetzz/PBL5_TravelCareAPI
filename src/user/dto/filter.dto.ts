import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @ApiProperty({ required: false })
  search: string;

  @IsOptional()
  @ApiProperty({ required: false })
  page: number;

  @IsOptional()
  @ApiProperty({ required: false })
  limit: number;
}
