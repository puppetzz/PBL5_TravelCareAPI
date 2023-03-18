import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Country } from './entities/country.entity';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Country, District, Province])],
  exports: [
    TypeOrmModule.forFeature([Address, Country, District, Province]),
    AddressService,
  ],
  providers: [AddressService],
})
export class AddressModule {}
