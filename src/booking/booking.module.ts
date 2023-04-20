import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Receipt } from './entities/reciept.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Receipt])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [TypeOrmModule.forFeature([Booking, Receipt]), BookingService],
})
export class BookingModule {}
