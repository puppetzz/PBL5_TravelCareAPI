import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/rom.entity';
import { Discount } from './entities/discount.entity';
import { RoomFeature } from './entities/room-feature.entity';
import { RoomType } from './entities/room-type.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Discount, RoomFeature, RoomType])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [
    TypeOrmModule.forFeature([Room, Discount, RoomFeature, RoomType]),
    RoomService,
  ],
})
export class RoomModule {}
