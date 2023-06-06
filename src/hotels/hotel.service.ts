import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PaginationResponse } from 'src/ultils/paginationResponse';
import { PaginationDto } from './dto/pagination.dto';
import { link } from 'fs';
import { defaulStatusRegisterLastProgress } from 'src/constant/constant';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
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

    if (hotel.location.user.accountId === user.accountId) {
      return true;
    }
    return false;
  }
  async getAllHotels(paginationDto: PaginationDto): Promise<{
    data: Hotel[];
    pagination: PaginationResponse;
  }> {
    const [data, pageSize] = await this.hotelRepository.findAndCount({
      where: { isRegistered: true },
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
      take: paginationDto.limit,
      skip: (paginationDto.page - 1) * paginationDto.limit,
    });
    const total = await this.hotelRepository.count();
    const totalPage = Math.ceil(total / paginationDto.limit);

    const pagination: PaginationResponse = {
      pageNumber: paginationDto.page,
      pageSize: pageSize,
      total: total,
      totalPage: totalPage,
    };

    return { data, pagination };
  }

  async getHotelById(id: string): Promise<Hotel> {
    return this.hotelRepository.findOne({
      where: {
        id: id,
      },
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
    });
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
}
