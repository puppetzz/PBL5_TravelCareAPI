import { Controller, Get } from '@nestjs/common';
import { RoomFeatureService } from './room-feature.service';
import { ApiTags } from '@nestjs/swagger';
import { RoomFeature } from './entities/room-feature.entity';

@Controller('roomFeatures')
@ApiTags('RoomFeature')
export class RoomFeatureController {
  constructor(private readonly roomService: RoomFeatureService) {}
  @Get()
  getRoomFeatures(): Promise<RoomFeature[]> {
    return this.roomService.getRoomFeatures();
  }
}
