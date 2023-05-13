import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyAmenity } from './entities/property-amenity.entity';
import { PropertyAmenityController } from './property-amenity.controller';
import { PropertyAmenityService } from './property-amenity.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyAmenity])],
  controllers: [PropertyAmenityController],
  providers: [PropertyAmenityService],
})
export class PropertyAmenityModule {}
