import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {}

  async createAddress(
    countryId: string,
    provinceId: string,
    districtId: string,
    wardId: string,
    streetAddress: string,
  ): Promise<Address> {
    if (!countryId)
      throw new BadRequestException('Country is required to create address');

    if (!provinceId)
      throw new BadRequestException('Province is required to create address');

    if (!districtId)
      throw new BadRequestException('District is required to create address');

    if (!wardId)
      throw new BadRequestException('Ward is required to create address');

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

  async updateAddress(
    addressId: string,
    countryid: string | null | undefined,
    provinceid: string | null | undefined,
    districtid: string | null | undefined,
    wardId: string | null | undefined,
    streetAddress: string | null | undefined,
  ): Promise<Address> {
    if (!addressId)
      throw new BadRequestException('Address is required when update address!');

    const isAddressExist = await this.addressRepository.exist({
      where: { id: addressId },
    });

    if (!isAddressExist) throw new BadRequestException('Address is not exist!');

    const address = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: {
        country: true,
        province: true,
        district: true,
        ward: true,
      },
    });

    if (countryid) {
      const country = await this.countryRepository.findOneOrFail({
        where: { id: countryid },
      });

      if (!country) throw new BadRequestException('Country not exist!');

      if (!!country && address.country.id != countryid) {
        address.country = country;
      }
    }

    if (provinceid) {
      const province = await this.provinceRepository.findOne({
        where: {
          id: provinceid,
          country: address.country,
        },
      });

      if (!province)
        throw new BadRequestException('Province must be in the country');

      if (!!province && address.province.id != provinceid) {
        address.province = province;
      }
    }

    if (districtid) {
      const district = await this.districtRepository.findOne({
        where: {
          id: districtid,
          province: address.province,
        },
      });

      if (!district)
        throw new BadRequestException('District must be in the provinces');

      if (!!district && address.district.id != districtid) {
        address.district = district;
      }
    }

    if (wardId) {
      const ward = await this.wardRepository.findOne({
        where: {
          id: wardId,
          district: address.district,
        },
      });

      if (!ward) throw new BadRequestException('ward must be in the district');

      if (!!ward && address.ward.id != wardId) {
        address.ward = ward;
      }
    }

    if (streetAddress) {
      address.streetAddress = streetAddress;
    }

    return await this.addressRepository.save(address);
  }
}
