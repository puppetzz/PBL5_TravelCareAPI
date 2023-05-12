import { Injectable, NotFoundException } from '@nestjs/common';
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
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';
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
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
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
      .leftJoinAndSelect('location.hotel', 'hotel')
      .innerJoinAndSelect('location.address', 'address')
      .innerJoinAndSelect('address.country', 'country')
      .innerJoinAndSelect('address.province', 'province')
      .innerJoinAndSelect('address.district', 'district')
      .innerJoinAndSelect('address.ward', 'ward')
      .addOrderBy('location.rating', 'DESC')
      .addOrderBy('location.reviewCount', 'DESC');
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
      phoneNumber,
      email,
      website,
      hotelClass,
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
    if (images) {
      for (const image of images) {
        const { key, url } = await this.s3Service.uploadImage(image);
        const locationImage = await this.locationImageRepository.create({
          imageKey: key,
          imageUrl: url,
          location: newLocation,
        });
        await this.locationImageRepository.save(locationImage);
      }
    }

    if (isHotel === true) {
      const newHotel = await this.hotelRepository.create({
        phoneNumber,
        email,
        website,
        hotelClass,
        location: newLocation,
      });
      await this.hotelRepository.save(newHotel);
    }

    const resultLocation = await this.locationRepository.findOne({
      where: {
        id: newLocation.id,
      },
      relations: {
        address: {
          country: true,
          province: true,
          district: true,
          ward: true,
        },
        categories: true,
        locationImages: true,
        hotel: true,
      },
    });
    return resultLocation;
  }
  async updateLocation(
    updateLocationDto: UpdateLocationDto,
    locationId: string,
  ): Promise<Location> {
    const updateLocation = await this.locationRepository.findOne({
      where: {
        id: locationId,
      },
      relations: ['address', 'locationImages', 'categories'],
    });
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
      currentImages,
      images,
    } = updateLocationDto;
    console.log(isHotel, typeof isHotel);

    if (!updateLocation) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }
    if (categories) {
      const categoriesArray = categories.split(',');
      if (categoriesArray.length) {
        const categories = await this.categoryRepository.findBy({
          id: In(categoriesArray.map((string) => parseInt(string))),
        });
        if (categories) {
          updateLocation.categories = categories;
        }
      }
    }

    const addressId = updateLocation.address.id;
    const updateAddress = await this.addressService.updateAddress(
      addressId,
      countryId,
      provinceId,
      districtId,
      wardId,
      streetAddress,
    );
    if (name) {
      updateLocation.name = name;
    }
    if (about) {
      updateLocation.about = about;
    }
    if (description) {
      updateLocation.description = description;
    }
    if (isHotel) {
      updateLocation.isHotel = isHotel;
    }
    updateLocation.address = updateAddress;

    await this.locationRepository.save(updateLocation);
    if (currentImages) {
      const currentImagesArray = updateLocationDto.currentImages?.split(',');
      if (currentImagesArray) {
        const currentImages = await this.locationImageRepository.findBy({
          imageUrl: In(currentImagesArray),
        });
        function isInImages(image: LocationImage) {
          for (const imageCurrent of currentImages) {
            if (image.id === imageCurrent.id) {
              return true;
            }
          }
          return false;
        }
        const deleteImages = updateLocation.locationImages.filter(
          (image) => !isInImages(image),
        );
        await this.locationImageRepository.remove(deleteImages);
      }
    }
    if (images) {
      for (const image of images) {
        const { key, url } = await this.s3Service.uploadImage(image);
        const locationImage = await this.locationImageRepository.create({
          imageKey: key,
          imageUrl: url,
          location: updateLocation,
        });
        await this.locationImageRepository.save(locationImage);
      }
    }
    const newLocation = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.categories', 'category')
      .leftJoinAndSelect('location.locationImages', 'locationImage')
      .innerJoinAndSelect('location.address', 'address')
      .innerJoinAndSelect('address.country', 'country')
      .innerJoinAndSelect('address.province', 'province')
      .innerJoinAndSelect('address.district', 'district')
      .innerJoinAndSelect('address.ward', 'ward')
      .getOne();

    return newLocation;
  }
}
