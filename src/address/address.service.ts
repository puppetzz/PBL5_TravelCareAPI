import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  generateUniqueId() {
    const id = BigInt(`0x${uuidv4().replace(/-/g, '')}`)
      .toString()
      .slice(0, 10);
    return id;
  }

  async createAddress(
    countryId: string,
    provinceId: string,
    districtId: string,
    streetAddress: string,
  ) {
    const id = await this.generateUniqueId();
    console.log(
      await this.countryRepository.findOne({ where: { id: countryId } }),
    );
    if (!(await this.countryRepository.findOne({ where: { id: countryId } })))
      throw new BadRequestException('Country does not exist');

    if (!(await this.provinceRepository.findOne({ where: { id: provinceId } })))
      throw new BadRequestException('Province not exists!');

    if (!this.districtRepository.findOne({ where: { id: districtId } }))
      throw new BadRequestException('District not exists!');

    const address = await this.addressRepository.create({
      id: id,
      streetAddress: streetAddress,
    });
    address.country = await this.countryRepository.findOne({
      where: {
        id: countryId,
      },
    });
    address.province = await this.provinceRepository.findOne({
      where: {
        id: provinceId,
      },
    });
    address.district = await this.districtRepository.findOne({
      where: {
        id: districtId,
      },
    });

    await this.addressRepository.save(address);
    return address;
  }
}
