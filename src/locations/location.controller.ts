import { Controller, Get, Logger, Query, ValidationPipe } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiTags } from '@nestjs/swagger';
import { Location } from './entities/location.entity';
import { FilterDto } from './dto/filterDTO';
import { defaultPage, defaultLimit } from '../constant/constant';
@Controller('locations')
@ApiTags('location')
export class LocationController {
  private readonly logger = new Logger(LocationController.name);
  constructor(private readonly locationService: LocationService) {}

  @Get()
  getLocations(
    @Query(ValidationPipe) filterDto: FilterDto,
  ): Promise<Location[]> {
    const { page = defaultPage, limit = defaultLimit } = filterDto;
    return this.locationService.getLocations({ ...filterDto, page, limit });
  }
}
