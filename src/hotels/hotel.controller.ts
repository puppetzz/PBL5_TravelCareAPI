import { Controller } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Controller()
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}
}
