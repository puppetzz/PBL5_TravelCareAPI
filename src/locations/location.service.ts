import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Address } from 'src/address/entities/address.entity';
import { District } from 'src/address/entities/district.entity';
import { Province } from 'src/address/entities/province.entity';
import { Country } from 'src/address/entities/country.entity';
import { FilterDto } from './dto/filterDTO';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async getLocations(filterDTO: FilterDto): Promise<Location[]> {
    const { id, search, page, limit } = filterDTO;

    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.reviews', 'review')
      .leftJoin('review.reviewImages', 'review-image')
      .innerJoin(Address, 'address', 'location.addressId = address.id')
      .innerJoin(District, 'district', 'address.districtId = district.id')
      .innerJoin(Province, 'province', 'address.provinceId = province.id')
      .innerJoin(Country, 'country', 'address.countryId = country.id')
      .select([
        'location',
        `(CONCAT(address.streetAddress, ', ', district.name, ', ', province.name, ', ', country.name)) AS address`,
        'COUNT(review.id) as reviewCount',
        `STRING_AGG(DISTINCT review-image.imageKey, ', ') as imagesReview`,
      ])
      .groupBy(
        'location.id, address.streetAddress, district.name, province.name, country.name',
      )
      .orderBy('location.rating', 'DESC')
      .addOrderBy('reviewCount', 'DESC');
    if (search) {
      const searchLower = search.toLowerCase();
      locations.where(
        `(CONCAT(LOWER(address.streetAddress), ', ', LOWER(district.name), ', ', LOWER(province.name), ', ', LOWER(country.name)) LIKE :address OR LOWER(location.name) LIKE :name)`,
        { address: `%${searchLower}%`, name: `%${searchLower}%` },
      );
    }
    if (id) {
      return locations.where('location.id = :id', { id: id }).getRawOne();
    }

    if (page && limit) {
      locations.limit(limit).offset((page - 1) * limit);
    }
    return locations.getRawMany();
  }
}
