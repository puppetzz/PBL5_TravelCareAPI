import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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
  async getAllHotels(): Promise<Hotel[]> {
    return this.hotelRepository.find({
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
        hotelStyles: true,
        propertyAmenities: true,
      },
    });
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
        hotelStyles: true,
        propertyAmenities: true,
      },
    });
  }
}
