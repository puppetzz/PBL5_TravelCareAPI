import { BadRequestException, Injectable } from '@nestjs/common';
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
    streetAddress: string | null,
  ): Promise<Address> {
    if (!countryId)
      throw new BadRequestException('Country is required to create address');

    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });
    if (!country) {
      throw new BadRequestException(
        `country with countryId ${countryId} is not exist`,
      );
    }

    const newAddress = this.addressRepository.create({
      country,
      streetAddress,
    });

    if (provinceId) {
      const province = await this.provinceRepository.findOneBy({
        id: provinceId,
        country: {
          id: country.id,
        },
      });

      if (!province)
        throw new BadRequestException(
          `Province with id ${provinceId} is not exist`,
        );

      newAddress.province = province;
    }

    if (districtId) {
      if (!provinceId && !newAddress.province)
        throw new BadRequestException(
          'Province should not be null when add district',
        );

      const district = await this.districtRepository.findOneBy({
        id: districtId,
        province: {
          id: newAddress.province.id,
        },
      });

      if (!district)
        throw new BadRequestException(
          `District with id ${districtId} is not exist`,
        );

      newAddress.district = district;
    }

    if (wardId) {
      if (!districtId && !newAddress.district)
        throw new BadRequestException(
          'District should not be null when add ward',
        );

      const ward = await this.wardRepository.findOneBy({
        id: wardId,
        district: {
          id: newAddress.district.id,
        },
      });

      if (!ward)
        throw new BadRequestException(`Ward with id ${wardId} is not exist`);

      newAddress.ward = ward;
    }

    await this.addressRepository.save(newAddress);
    return newAddress;
  }

  async updateAddress(
    addressId: string,
    countryId: string | null | undefined,
    provinceId: string | null | undefined,
    districtId: string | null | undefined,
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

    if (countryId) {
      const country = await this.countryRepository.findOneOrFail({
        where: { id: countryId },
      });

      if (!country) throw new BadRequestException('Country not exist!');

      if (!!country && address.country.id != countryId) {
        address.country = country;
      }
    }

    if (provinceId) {
      if (!address.country)
        throw new BadRequestException(
          'Country is required when update province',
        );

      const province = await this.provinceRepository.findOne({
        where: {
          id: provinceId,
          country: {
            id: address.country.id,
          },
        },
      });

      if (!province)
        throw new BadRequestException('Province must be in the country');

      if (!!province && address.province?.id != provinceId) {
        address.province = province;
      }
    }

    if (districtId) {
      if (!address.province)
        throw new BadRequestException(
          'Provice is requeired when update district',
        );

      const district = await this.districtRepository.findOne({
        where: {
          id: districtId,
          province: {
            id: address.province.id,
          },
        },
      });

      if (!district)
        throw new BadRequestException('District must be in the provinces');

      if (!!district && address.district?.id != districtId) {
        address.district = district;
      }
    }

    if (wardId) {
      if (!address.district)
        throw new BadRequestException('District is required when update ward');

      const ward = await this.wardRepository.findOne({
        where: {
          id: wardId,
          district: {
            id: address.district.id,
          },
        },
      });

      if (!ward) throw new BadRequestException('ward must be in the district');

      if (!!ward && address.ward?.id != wardId) {
        address.ward = ward;
      }
    }

    if (!wardId) {
      address.ward = null;
    }

    if (!districtId) {
      if (address.ward) throw new BadRequestException('District is required');
      address.district = null;
    }

    if (!provinceId) {
      if (address.ward) throw new BadRequestException('Province is required');
      if (address.district)
        throw new BadRequestException('Province is required');

      address.province = null;
    }

    if (streetAddress !== null && streetAddress !== undefined) {
      address.streetAddress = streetAddress;
    }

    if (!streetAddress) address.streetAddress = null;

    return await this.addressRepository.save(address);
  }

  async deleteAddress(id: string): Promise<void> {
    await this.addressRepository.delete(id);
  }

  async getAllCountry(): Promise<Country[]> {
    const countries = await this.countryRepository.find();
    return countries;
  }

  async getProvinceByCountry(countryId: string): Promise<Province[]> {
    const country = await this.countryRepository.findOneBy({ id: countryId });
    return await this.provinceRepository.findBy({
      country: { id: country.id },
    });
  }

  async getDistrictByProvince(provinceId: string): Promise<District[]> {
    const province = await this.provinceRepository.findOneBy({
      id: provinceId,
    });
    return await this.districtRepository.findBy({
      province: { id: province.id },
    });
  }

  async getWardByDistrict(districtId: string): Promise<Ward[]> {
    const district = await this.districtRepository.findOneBy({
      id: districtId,
    });
    return await this.wardRepository.findBy({ district: { id: district.id } });
  }

  async getAll(): Promise<Country[]> {
    const countries = await this.countryRepository.find({
      relations: {
        provinces: {
          districts: {
            wards: true,
          },
        },
      },
    });

    return countries;
  }
}
