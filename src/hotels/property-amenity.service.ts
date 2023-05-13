import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyAmenity } from './entities/property-amenity.entity';

@Injectable()
export class PropertyAmenityService {
  constructor(
    @InjectRepository(PropertyAmenity)
    private propertyAmnenityRepository: Repository<PropertyAmenity>,
  ) {}
  async getHotelStyles(): Promise<PropertyAmenity[]> {
    return this.propertyAmnenityRepository.find();
  }
}
