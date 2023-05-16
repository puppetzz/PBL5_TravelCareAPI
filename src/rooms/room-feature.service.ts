import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomFeature } from './entities/room-feature.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomFeatureService {
  constructor(
    @InjectRepository(RoomFeature)
    private roomFeatureRepository: Repository<RoomFeature>,
  ) {}
  async getRoomFeatures(): Promise<RoomFeature[]> {
    return this.roomFeatureRepository.find();
  }
}
