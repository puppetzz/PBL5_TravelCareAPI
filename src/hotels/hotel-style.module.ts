import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelStyle } from './entities/hotel-style.entity';
import { HotelStyleService } from './hotel-style.service';
import { HotelStyleController } from './hotel-style.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HotelStyle])],
  controllers: [HotelStyleController],
  providers: [HotelStyleService],
})
export class HotelStyleModule {}
