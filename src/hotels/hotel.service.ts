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
}
