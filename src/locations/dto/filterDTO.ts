import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  id: string;

  @IsOptional()
  search: string;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
