import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Country } from './entities/country.entity';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';
import { AddressService } from './address.service';
import { Ward } from './entities/ward.entity';
import { AddressController } from './address.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, Country, District, Province, Ward]),
  ],
  exports: [
    TypeOrmModule.forFeature([Address, Country, District, Province, Ward]),
    AddressService,
  ],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
