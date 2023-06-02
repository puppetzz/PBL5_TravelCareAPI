import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bed } from './entities/bed.entity';

@Injectable()
export class BedService {
  constructor(
    @InjectRepository(Bed)
    private bedRepository: Repository<Bed>,
  ) {}
  async getBed(): Promise<Bed[]> {
    return this.bedRepository.find();
  }
}
