import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(LocationImage)
    private locationImageRepository: Repository<LocationImage>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(PropertyAmenity)
    private propertyAmenityRepository: Repository<PropertyAmenity>,
    @InjectRepository(HotelStyle)
    private hotelStyleRepository: Repository<HotelStyle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
    private readonly addressService: AddressService,
  ) {}

  async getLocations(
    user: User,
    filterDTO: FilterDto,
  ): Promise<{ data: Location[]; pagination: PaginationResponse }> {
    const { search, page, limit } = filterDTO;
    const locations = this.locationRepository
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
      .addOrderBy('location.reviewCount', 'DESC')
      .where(
        '(hotel.isRegistered = TRUE AND hotel.id IS NOT NULL) OR (hotel.id IS NULL)',
      );

    if (user) {
      locations.leftJoinAndSelect(
        'location.wishList',
        'wishList',
        'wishList.userAccountId = :accountId',
        { accountId: user.accountId },
      );
    }

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
    data.sort((a, b) => {
      // Replace the logic below with your actual rating calculation for each location
      const ratingA = a.rating;
      const ratingB = b.rating;

      // Sort in descending order
      if (ratingA > ratingB) {
        return -1;
      } else if (ratingA < ratingB) {
        return 1;
      } else {
        return 0;
      }
    });

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

    const newLocation = this.locationRepository.create({
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
        const locationImage = this.locationImageRepository.create({
          imageKey: key,
          imageUrl: url,
          location: newLocation,
        });
        await this.locationImageRepository.save(locationImage);
      }
    }

    if (isHotel === true) {
      const newHotel = this.hotelRepository.create({
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

      user.isSale = true;

      await this.hotelRepository.save(newHotel);
      await this.userRepository.save(user);
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

    const {
      name,
      about,
      description,
      hotelStyleIds,
      propertyAmenities,
      hotelClass,
      phoneNumber,
      email,
      website,
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
    const isHotel = JSON.parse(updateLocationDto.isHotel);
    if (isHotel) {
      if (hotelStyleIds) {
        const hotelArray = hotelStyleIds.split(',');
        const hotelStyle = await this.hotelStyleRepository.findBy({
          id: In(hotelArray),
        });
        updateLocation.hotel.hotelStyles = hotelStyle;
      }
      if (propertyAmenities) {
        const propertyArray = propertyAmenities.split(',');
        const properties = await this.propertyAmenityRepository.findBy({
          id: In(propertyArray),
        });
        updateLocation.hotel.propertyAmenities = properties;
      }
      if (hotelClass) {
        updateLocation.hotel.hotelClass = hotelClass;
      }
      if (phoneNumber) {
        updateLocation.hotel.phoneNumber = phoneNumber;
      }
      if (website) {
        updateLocation.hotel.website = website;
      }
      if (email) {
        updateLocation.hotel.email = email;
      }
      await this.hotelRepository.save(updateLocation.hotel);
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

    return result;
  }
  async getLocationById(id: string, user: User = null): Promise<Location> {
    const location = this.locationRepository
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
      .where('location.id = :id', { id });

    if (user) {
      location.leftJoinAndSelect(
        'location.wishList',
        'wishList',
        'wishList.userAccountId = :accountId',
        { accountId: user.accountId },
      );
    }

    return location.getOne();
  }

  async uploadLocationimage(
    user: User,
    locationId: string,
    images: Express.Multer.File[],
  ) {
    const location = await this.locationRepository.findOne({
      where: {
        id: locationId,
      },
      relations: {
        user: true,
      },
    });

    if (user.accountId !== location.user.accountId)
      if (!(await this.checkRoleAdmin(user)))
        throw new BadRequestException(
          'You must be owner or admin to upload image for location',
        );

    if (!location) throw new BadRequestException('Location is not exist!');

    for (const image of images) {
      const { key, url } = await this.s3Service.uploadImage(image);

      const locationImage = this.locationImageRepository.create({
        imageKey: key,
        imageUrl: url,
        location: location,
      });

      await this.locationImageRepository.save(locationImage);
    }

    return await this.getLocationById(locationId);
  }

  async deleteLocationImage(
    user: User,
    locationId: string,
    locationImageId: string,
  ) {
    const location = await this.locationRepository.findOne({
      where: {
        id: locationId,
        locationImages: {
          id: locationImageId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (user.accountId !== location.user.accountId)
      if (!(await this.checkRoleAdmin(user)))
        throw new BadRequestException(
          'You must be owner or admin to delete image of location',
        );

    if (!location) throw new BadRequestException('Image is not in location');

    const locationImage = await this.locationImageRepository.findOneBy({
      id: locationImageId,
    });

    if (!locationImage)
      throw new BadRequestException('Location Image not exist!');

    await this.s3Service.deleteImage(locationImage.imageKey);

    const affectedResult = await this.locationImageRepository.delete({
      id: locationImageId,
    });

    if (affectedResult.affected > 0) {
      return 'Delete successfully!';
    }
    return 'No delete effected!';
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
