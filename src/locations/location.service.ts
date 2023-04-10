import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Address } from 'src/address/entities/address.entity';
import { District } from 'src/address/entities/district.entity';
import { Province } from 'src/address/entities/province.entity';
import { Country } from 'src/address/entities/country.entity';
import { FilterDto } from './dto/filterDTO';
import { CreateLocationDTO } from './dto/createLocationDTO';
import { User } from 'src/user/entities/user.entity';
import { S3Service } from '../aws-s3/s3.service';
import { Category } from './entities/category.entity';
import { AddressService } from 'src/address/address.service';
import { Ward } from 'src/address/entities/ward.entity';
import { LocationImage } from './entities/location-image.entity';
@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LocationImage)
    private locationImageRepository: Repository<LocationImage>,
    private readonly s3Service: S3Service,
    private readonly addressService: AddressService,
  ) {}

  async getLocations(filterDTO: FilterDto): Promise<Location[]> {
    const { id, search, page, limit } = filterDTO;

    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.reviews', 'review')
      .leftJoin('location.locationImages', 'locationImage')
      .leftJoin('review.reviewImages', 'review-image')
      .innerJoin(Address, 'address', 'location.addressId = address.id')
      .innerJoin(District, 'district', 'address.districtId = district.id')
      .innerJoin(Province, 'province', 'address.provinceId = province.id')
      .innerJoin(Country, 'country', 'address.countryId = country.id')
      .innerJoin(Ward, 'ward', 'address.wardId = ward.id')
      .select([
        'location',
        `(CONCAT(address.streetAddress,', ', ward.name, ', ', district.name, ', ', province.name, ', ', country.name)) AS address`,
        'COUNT(review.id) as reviewCount',
        `STRING_AGG(DISTINCT review-image.imageKey, ', ') as imagesReview`,
        `STRING_AGG(DISTINCT locationImage.imageKey, ', ') as locationImages`,
      ])
      .groupBy(
        'location.id, address.streetAddress, district.name, province.name, country.name ,ward.name',
      )
      .orderBy('location.rating', 'DESC')
      .addOrderBy('reviewCount', 'DESC');
    if (search) {
      const searchLower = search.toLowerCase();
      locations.where(
        `(CONCAT(LOWER(address.streetAddress), ', ', LOWER(district.name), ', ', LOWER(province.name), ', ', LOWER(country.name), ', ', LOWER(ward.name)) LIKE :address OR LOWER(location.name) LIKE :name)`,
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

  async createLocation(
    createLocationDto: CreateLocationDTO,
    user: User,
    images: Express.Multer.File[],
  ): Promise<Location> {
    const {
      name,
      about,
      description,
      isHotel,
      categories,
      countryId,
      provinceId,
      districtId,
      wardId,
      streetAddress,
    } = createLocationDto;

    const newAddress = await this.addressService.createAddress(
      countryId,
      provinceId,
      districtId,
      wardId,
      streetAddress,
    );
    await this.addressRepository.save(newAddress);
    const categoryEntities = await this.categoryRepository.findBy({
      id: In(categories),
    });
    const locationImages = [];

    for (const image of images) {
      const imageKey = await this.s3Service.uploadImage(image);
      locationImages.push(imageKey);
    }

    const newLocation = await this.locationRepository.create({
      address: newAddress,
      about,
      description,
      isHotel,
      name,
      user,
      categories: categoryEntities,
    });
    newLocation.locationImages = locationImages;
    await this.locationRepository.save(newLocation);
    return newLocation;
  }
}
