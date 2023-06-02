import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bed } from './entities/bed.entity';
import { BedController } from './bed.controller';
import { BedService } from './bed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bed])],
  controllers: [BedController],
  providers: [BedService],
})
export class BedModule {}
