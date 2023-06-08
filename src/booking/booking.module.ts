import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Receipt } from './entities/reciept.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { LocationModule } from 'src/locations/location.module';
import { RoomModule } from 'src/rooms/room.module';
import { UserModule } from 'src/user/user.module';
import { HotelModule } from 'src/hotels/hotels.module';
import { BookingRoom } from './entities/booking-room.entity';
import { ExchangeRate } from 'src/paypal/entities/exchange-rate.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Receipt, BookingRoom, ExchangeRate]),
    LocationModule,
    RoomModule,
    forwardRef(() => UserModule),
    forwardRef(() => HotelModule),
    HttpModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [TypeOrmModule.forFeature([Booking, Receipt]), BookingService],
})
export class BookingModule {}
