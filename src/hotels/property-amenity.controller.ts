import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PropertyAmenityService } from './property-amenity.service';
import { PropertyAmenity } from './entities/property-amenity.entity';

@Controller('propertyAmenities')
@ApiTags('PropertyAmenities')
export class PropertyAmenityController {
  constructor(private propertyAmenityService: PropertyAmenityService) {}
  @Get()
  getCategories(): Promise<PropertyAmenity[]> {
    return this.propertyAmenityService.getHotelStyles();
  }
}
