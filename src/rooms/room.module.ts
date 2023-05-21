import { Module, forwardRef } from '@nestjs/common';
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
import { HotelModule } from 'src/hotels/hotels.module';
import { RoomImage } from './entities/room-image.entity';
import { S3Module } from 'src/aws-s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Room,
      Discount,
      RoomFeature,
      RoomType,
      Hotel,
      RoomImage,
    ]),
    DiscountModule,
    RoomFeatureModule,
    RoomTypeModule,
    S3Module,
    forwardRef(() => HotelModule),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [
    TypeOrmModule.forFeature([Room, Discount, RoomFeature, RoomType, Hotel]),
    RoomService,
  ],
})
export class RoomModule {}
