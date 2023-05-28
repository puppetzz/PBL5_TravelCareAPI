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
import { PropertyAmenity } from 'src/hotels/entities/property-amenity.entity';
import { HotelStyle } from 'src/hotels/entities/hotel-style.entity';
import { PaginationResponse } from 'src/ultils/paginationResponse';
import { Pagination } from 'nestjs-typeorm-paginate';
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
    @InjectRepository(PropertyAmenity)
    private propertyAmenityRepository: Repository<PropertyAmenity>,
    @InjectRepository(HotelStyle)
    private hotelStyleRepository: Repository<HotelStyle>,
    private readonly s3Service: S3Service,
    private readonly addressService: AddressService,
  ) {}

  async getLocations(
    filterDTO: FilterDto,
  ): Promise<{ data: Location[]; pagination: PaginationResponse }> {
    const { search, page, limit } = filterDTO;
    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.reviews', 'review')
      .leftJoinAndSelect('location.locationImages', 'locationImage')
      .leftJoinAndSelect('review.reviewImages', 'review-image')
      .leftJoinAndSelect('location.categories', 'category')
      .leftJoinAndSelect('location.hotel', 'hotel')
      .leftJoinAndSelect('hotel.hotelStyles', 'hotelStyles')
      .leftJoinAndSelect('hotel.propertyAmenities', 'propertyAmenities')
      .leftJoinAndSelect('location.address', 'address')
      .leftJoinAndSelect('address.country', 'country')
      .leftJoinAndSelect('address.province', 'province')
      .leftJoinAndSelect('address.district', 'district')
      .leftJoinAndSelect('address.ward', 'ward')
      .addOrderBy('location.rating', 'DESC')
      .addOrderBy('location.reviewCount', 'DESC');
    if (search) {
      const searchLower = search.toLowerCase();
      locations.where(
        `(CONCAT(LOWER(address.streetAddress), ', ', LOWER(district.name), ', ', LOWER(province.name), ', ', LOWER(country.name), ', ', LOWER(ward.name)) LIKE :address OR LOWER(location.name) LIKE :name)`,
        { address: `%${searchLower}%`, name: `%${searchLower}%` },
      );
    }
    if (page && limit) {
      locations.take(limit).skip((page - 1) * limit);
    }
    const [data, totalCount] = await locations.getManyAndCount();
    const total = await this.locationRepository.count();
    const totalPage = Math.ceil(total / limit);

    const pagination: PaginationResponse = {
      pageNumber: page,
      pageSize: totalCount,
      total: total,
      totalPage: totalPage,
    };

    return { data, pagination };
  }

  async createLocation(
    createLocationDto: CreateLocationDTO,
    user: User,
  ): Promise<Location> {
    const {
      name,
      about,
      description,
      phoneNumber,
      email,
      website,
      hotelStyleIds,
      propertyAmenities,
      hotelClass,
      categories,
      countryId,
      provinceId,
      districtId,
      wardId,
      streetAddress,
      images,
    } = createLocationDto;
    const isHotel = JSON.parse(createLocationDto.isHotel);
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

      if (hotelStyleIds) {
        const hotelArray = hotelStyleIds.split(',');
        const hotelStyle = await this.hotelStyleRepository.findBy({
          id: In(hotelArray),
        });
        newHotel.hotelStyles = hotelStyle;
      }
      if (propertyAmenities) {
        const propertyArray = propertyAmenities.split(',');
        const properties = await this.propertyAmenityRepository.findBy({
          id: In(propertyArray),
        });
        newHotel.propertyAmenities = properties;
      }
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
        hotel: {
          hotelStyles: true,
          propertyAmenities: true,
        },
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
    console.log(updateLocation);

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

    if (!updateLocation) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }
    if (categories) {
      const categoriesArray = categories.split(',');
      if (categoriesArray.length) {
        const categories = await this.categoryRepository.findBy({
          id: In(categoriesArray),
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
    const result = await this.locationRepository.findOne({
      where: {
        id: locationId,
      },
      relations: ['address', 'locationImages', 'categories', 'hotel'],
    });
    return result;
  }
  async getLocationById(
    id: string,
  ): Promise<{ data: Location; imageUrlLocation: string[] }> {
    const data = await this.locationRepository.findOne({
      where: {
        id: id,
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
        hotel: {
          hotelStyles: true,
          propertyAmenities: true,
        },
        reviews: {
          reviewImages: true,
        },
      },
    });
    const imageUrlLocation = [];
    for (const image of data.locationImages) {
      imageUrlLocation.push(image.imageUrl);
    }
    for (const review of data.reviews) {
      for (const image of review.reviewImages) {
        imageUrlLocation.push(image.imageUrl);
      }
    }
    return { data, imageUrlLocation };
  }
  async deleteLocation(id: string): Promise<void> {
    await this.locationRepository.delete(id);
  }
  async checkRoleAdmin(user: User): Promise<boolean> {
    if (user.role.toString().toLowerCase().includes('admin')) {
      return true;
    }
    return false;
  }
}
