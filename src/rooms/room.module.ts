import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Discount } from './entities/discount.entity';
import { RoomFeature } from './entities/room-feature.entity';
import { RoomType } from './entities/room-type.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { DiscountModule } from './discount.module';
import { RoomFeatureModule } from './room-feature.module';
import { RoomTypeModule } from './room-type.module';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Discount, RoomFeature, RoomType, Hotel]),
    DiscountModule,
    RoomFeatureModule,
    RoomTypeModule,
  ],
  exports: [
    TypeOrmModule.forFeature([Room, Discount, RoomFeature, RoomType, Hotel]),
    RoomService,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
