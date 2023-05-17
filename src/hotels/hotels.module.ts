import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { HotelImage } from './entities/hotel-image.entity';
import { HotelStyle } from './entities/hotel-style.entity';
import { PropertyAmenity } from './entities/property-amenity.entity';
import { Language } from './entities/language.entity';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { RoomModule } from 'src/rooms/room.module';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hotel,
      HotelImage,
      HotelStyle,
      PropertyAmenity,
      Language,
      Room,
    ]),
    RoomModule,
  ],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [
    TypeOrmModule.forFeature([
      Hotel,
      HotelImage,
      HotelStyle,
      PropertyAmenity,
      Language,
    ]),
    HotelService,
  ],
})
export class HotelModule {}
