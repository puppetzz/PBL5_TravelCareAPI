import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomFeature } from './entities/room-feature.entity';
import { RoomFeatureController } from './room-feature.controller';
import { RoomFeatureService } from './room-feature.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomFeature])],
  controllers: [RoomFeatureController],
  providers: [RoomFeatureService],
})
export class RoomFeatureModule {}
