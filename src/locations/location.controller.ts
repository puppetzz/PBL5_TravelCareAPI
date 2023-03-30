import { Controller } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('location')
@ApiTags('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
}
