import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Address } from 'src/address/entities/address.entity';
import { FilterDto } from './dto/filterDTO';
import { CreateLocationDTO } from './dto/createLocationDTO';
import { User } from 'src/user/entities/user.entity';
import { S3Service } from '../aws-s3/s3.service';
import { Category } from './entities/category.entity';
import { AddressService } from 'src/address/address.service';
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
      .leftJoinAndSelect('location.reviews', 'review')
      .leftJoinAndSelect('location.locationImages', 'locationImage')
      .leftJoinAndSelect('review.reviewImages', 'review-image')
      .leftJoinAndSelect('location.categories', 'category')
      .innerJoinAndSelect('location.address', 'address')
      .innerJoinAndSelect('address.country', 'country')
      .innerJoinAndSelect('address.province', 'province')
      .innerJoinAndSelect('address.district', 'district')
      .innerJoinAndSelect('address.ward', 'ward')
      .addOrderBy('location.rating', 'DESC');

    if (search) {
      const searchLower = search.toLowerCase();
      locations.where(
        `(CONCAT(LOWER(address.streetAddress), ', ', LOWER(district.name), ', ', LOWER(province.name), ', ', LOWER(country.name), ', ', LOWER(ward.name)) LIKE :address OR LOWER(location.name) LIKE :name)`,
        { address: `%${searchLower}%`, name: `%${searchLower}%` },
      );
    }
    if (id) {
      return await locations.where('location.id = :id', { id: id }).getMany();
    }

    if (page && limit) {
      locations.limit(limit).offset((page - 1) * limit);
    }
    const result = await locations.getMany();

    return result;
  }

  async createLocation(
    createLocationDto: CreateLocationDTO,
    user: User,
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
      images,
    } = createLocationDto;

    const newAddress = await this.addressService.createAddress(
      countryId,
      provinceId,
      districtId,
      wardId,
      streetAddress,
    );
    await this.addressRepository.save(newAddress);
    const categoriesArray = categories.split(',');
    const categoryEntities = await this.categoryRepository.findBy({
      id: In(categoriesArray),
    });

    const newLocation = await this.locationRepository.create({
      address: newAddress,
      about,
      description,
      isHotel,
      name,
      user,
      categories: categoryEntities,
    });
    await this.locationRepository.save(newLocation);
    const locationImages = [];

    for (const image of images) {
      const { key, url } = await this.s3Service.uploadImage(image);
      const locationImage = await this.locationImageRepository.create({
        imageKey: key,
        imageUrl: url,
        location: newLocation,
      });
      await this.locationImageRepository.save(locationImage);
      locationImages.push(url);
    }
    await this.locationRepository.save(newLocation);

    newLocation.locationImages = locationImages;

    return newLocation;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
}
