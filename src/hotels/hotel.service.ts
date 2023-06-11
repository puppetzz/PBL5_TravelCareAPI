import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PaginationResponse } from 'src/ultils/paginationResponse';
import {
  defaulStatusRegisterLastProgress,
  defaultLimit,
  defaultPage,
} from 'src/constant/constant';
import { FilterDto } from './dto/filter.dto';
import { BookingService } from 'src/booking/booking.service';
import { HotelResponse } from './types/response-hotel.type';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    private readonly bookingService: BookingService,
  ) {}

  async checkIfOwner(hotelId: string, user: User): Promise<boolean> {
    const hotel = await this.hotelRepository.findOne({
      where: { id: hotelId },
      relations: {
        location: {
          user: true,
        },
      },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.location.user.accountId === user.accountId) {
      return true;
    }
    return false;
  }

  async getAllHotels(user: User, filterDto: FilterDto): Promise<HotelResponse> {
    const { page = defaultPage, limit = defaultLimit } = filterDto;
    const hotels = this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.location', 'location')
      .leftJoinAndSelect('location.locationImages', 'locationImages')
      .leftJoinAndSelect('location.reviews', 'reviews')
      .leftJoinAndSelect('reviews.reviewImages', 'reviewImages')
      .leftJoinAndSelect('location.categories', 'categories')
      .leftJoinAndSelect('location.address', 'address')
      .leftJoinAndSelect('address.country', 'country')
      .leftJoinAndSelect('address.province', 'province')
      .leftJoinAndSelect('address.district', 'district')
      .leftJoinAndSelect('address.ward', 'ward')
      .leftJoinAndSelect('hotel.hotelStyles', 'hotelStyles')
      .leftJoinAndSelect('hotel.propertyAmenities', 'propertyAmenities')
      .leftJoinAndSelect('hotel.languages', 'languages')
      .leftJoinAndSelect('hotel.rooms', 'rooms')
      .leftJoinAndSelect('rooms.roomFeatures', 'roomFeatures')
      .leftJoinAndSelect('rooms.roomTypes', 'roomTypes')
      .orderBy('location.rating', 'DESC')
      .orderBy('location.reviewCount', 'DESC')
      .where(`hotel.isRegistered = TRUE`);

    if (user)
      hotels.leftJoinAndSelect(
        'location.wishList',
        'wishList',
        'wishList.userAccountId = :accountId',
        { accountId: user.accountId },
      );

    if (filterDto.search) {
      const searchLower = filterDto.search.toLowerCase();
      hotels.where(
        `(CONCAT(LOWER(address.streetAddress), ', ', LOWER(district.name), ', ', LOWER(province.name), ', ', LOWER(country.name), ', ', LOWER(ward.name)) LIKE :address OR LOWER(location.name) LIKE :name)`,
        { address: `%${searchLower}%`, name: `%${searchLower}%` },
      );
    }

    if (page && limit) {
      hotels.take(limit).skip((page - 1) * limit);
    }

    if (filterDto.sleeps) {
      hotels.where(`rooms.sleeps >= ${filterDto.sleeps}`);
    }

    const [data, totalCount] = await hotels.getManyAndCount();

    const total = await this.hotelRepository.count({
      where: {
        isRegistered: true,
      },
    });
    const totalPage = Math.ceil(total / limit);

    const pagination: PaginationResponse = {
      pageNumber: page,
      pageSize: totalCount,
      total: total,
      totalPage: totalPage,
    };

    if (filterDto.checkIn && filterDto.checkOut && filterDto.numberOfRooms) {
      const checkIn = new Date(filterDto.checkIn);
      const checkOut = new Date(filterDto.checkOut);

      const data = [];

      for (const hotel of await hotels.getMany()) {
        let isValid = false;

        for (const room of hotel.rooms) {
          const availableRooms = await this.bookingService.getAvailablesRoom(
            room.id,
            checkIn,
            checkOut,
          );

          if (availableRooms >= filterDto.numberOfRooms) {
            isValid = true;
            break;
          }
        }

        if (isValid) {
          data.push(hotel);
        }
      }

      return { data, pagination };
    }

    return { data, pagination };
  }

  async getHotelById(id: string, user: User = null): Promise<Hotel> {
    const hotel = this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.location', 'location')
      .leftJoinAndSelect('location.locationImages', 'locationImages')
      .leftJoinAndSelect('location.reviews', 'reviews')
      .leftJoinAndSelect('reviews.reviewImages', 'reviewImages')
      .leftJoinAndSelect('location.categories', 'categories')
      .leftJoinAndSelect('location.address', 'address')
      .leftJoinAndSelect('address.country', 'country')
      .leftJoinAndSelect('address.province', 'province')
      .leftJoinAndSelect('address.district', 'district')
      .leftJoinAndSelect('address.ward', 'ward')
      .leftJoinAndSelect('hotel.hotelStyles', 'hotelStyles')
      .leftJoinAndSelect('hotel.propertyAmenities', 'propertyAmenities')
      .leftJoinAndSelect('hotel.languages', 'languages')
      .leftJoinAndSelect('hotel.rooms', 'rooms')
      .leftJoinAndSelect('rooms.roomFeatures', 'roomFeatures')
      .leftJoinAndSelect('rooms.roomTypes', 'roomTypes')
      .where('hotel.id = :id', { id });

    if (user)
      hotel.leftJoinAndSelect(
        'location.wishList',
        'wishList',
        'wishList.userAccountId = :accountId',
        { accountId: user.accountId },
      );

    return hotel.getOne();
  }

  async getHotelsForOwner(user: User): Promise<Hotel[]> {
    const hotels = await this.hotelRepository.find({
      relations: {
        location: {
          locationImages: true,
          categories: true,
          address: {
            country: true,
            province: true,
            district: true,
            ward: true,
          },
          hotel: false,
        },
        rooms: true,
        hotelStyles: true,
        propertyAmenities: true,
      },
      where: {
        location: {
          user: {
            accountId: user.accountId,
          },
        },
      },
    });
    return hotels;
  }

  async registerHotelForOwner(user: User, hotelId: string): Promise<Hotel> {
    if (!(await this.checkIfOwner(hotelId, user))) {
      throw new UnauthorizedException(`user not owner of ${hotelId}`);
    }
    const hotel = await this.getHotelById(hotelId);
    if (hotel.statusRegisterProgress < defaulStatusRegisterLastProgress) {
      throw new BadRequestException(`Please complete all the steps`);
    }
    hotel.isRegistered = true;
    await this.hotelRepository.save(hotel);
    return await this.getHotelById(hotelId);
  }
  async deleteHotel(hotelId: string, user: User): Promise<void> {
    if (!(await this.checkIfOwner(hotelId, user))) {
      throw new UnauthorizedException(`user not owner of ${hotelId}`);
    }
    await this.hotelRepository.delete(hotelId);
  }
}
