import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Ward } from './entities/ward.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(District)
    private wardRepository: Repository<Ward>,
  ) {}

  async createAddress(
    countryId: string,
    provinceId: string,
    districtId: string,
    wardId: string,
    streetAddress: string,
  ) {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });
    if (!country) {
      throw new NotFoundException(`country ${countryId} not found`);
    }
    const province = await this.provinceRepository.findOne({
      where: { id: provinceId },
    });
    if (!province) {
      throw new NotFoundException(`province ${provinceId} not found`);
    }

    const district = await this.districtRepository.findOne({
      where: { id: districtId },
    });
    if (!district) {
      throw new NotFoundException(`district ${districtId} not found`);
    }

    const ward = await this.wardRepository.findOne({
      where: { id: wardId },
    });
    if (!ward) {
      throw new NotFoundException(`ward ${wardId} not found`);
    }
    const newAddress = await this.addressRepository.create({
      country,
      province,
      district,
      ward,
      streetAddress,
    });

    await this.addressRepository.save(newAddress);
    return newAddress;
  }
}
