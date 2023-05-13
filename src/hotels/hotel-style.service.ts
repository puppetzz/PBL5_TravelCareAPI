import { Injectable } from '@nestjs/common';
import { HotelStyle } from './entities/hotel-style.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HotelStyleService {
  constructor(
    @InjectRepository(HotelStyle)
    private hotelStyleRepository: Repository<HotelStyle>,
  ) {}
  async getHotelStyles(): Promise<HotelStyle[]> {
    return this.hotelStyleRepository.find();
  }
}
