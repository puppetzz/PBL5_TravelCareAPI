import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomTypeService } from './room-type.service';
import { RoomType } from './entities/room-type.entity';

@Controller('roomTypes')
@ApiTags('RoomTypes')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}
  @Get()
  getRoomTypes(): Promise<RoomType[]> {
    return this.roomTypeService.getRoomTypes();
  }
}
