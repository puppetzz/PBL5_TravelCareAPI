import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomType } from './entities/room-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
  ) {}
  async getRoomTypes(): Promise<RoomType[]> {
    return this.roomTypeRepository.find();
  }
}
