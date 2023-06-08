import { PaginationResponse } from 'src/ultils/paginationResponse';
import { Hotel } from '../entities/hotel.entity';

export type HotelResponse = {
  data: Hotel[];
  pagination: PaginationResponse;
};
