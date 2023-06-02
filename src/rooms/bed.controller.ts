import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BedService } from './bed.service';
import { Bed } from './entities/bed.entity';

@Controller('beds')
@ApiTags('Bed')
export class BedController {
  constructor(private readonly bedService: BedService) {}
  @Get()
  getBeds(): Promise<Bed[]> {
    return this.bedService.getBed();
  }
}
