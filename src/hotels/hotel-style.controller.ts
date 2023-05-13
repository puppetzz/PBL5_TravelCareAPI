import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HotelStyleService } from './hotel-style.service';
import { HotelStyle } from './entities/hotel-style.entity';

@Controller('hotelStyles')
@ApiTags('HotelStyle')
export class HotelStyleController {
  constructor(private hotelStyleService: HotelStyleService) {}
  @Get()
  getCategories(): Promise<HotelStyle[]> {
    return this.hotelStyleService.getHotelStyles();
  }
}
