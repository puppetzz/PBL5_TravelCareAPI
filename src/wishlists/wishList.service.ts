import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishList } from './wishList.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/locations/entities/location.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishList)
    private wishListRepository: Repository<WishList>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}
  async getWishListByUser(user: User): Promise<WishList[]> {
    return await this.wishListRepository.find({
      where: {
        user: user,
      },
      relations: {
        location: {
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
      },
    });
  }
  async createWishList(user: User, locationId: string): Promise<WishList> {
    const location = await this.locationRepository.findOneBy({
      id: locationId,
    });
    const newWishList = await this.wishListRepository.create({
      user,
      location,
    });
    return await this.wishListRepository.save(newWishList);
  }
  async deleteWishList(user: User, wishListId: string): Promise<void> {
    if (await this.checkOwnerWishList(user, wishListId)) {
      await this.wishListRepository.delete(wishListId);
    } else {
      throw new UnauthorizedException(
        `User not owner of ${wishListId} wish list or Not found wishlist`,
      );
    }
  }
  async checkOwnerWishList(user: User, wishListId: string): Promise<boolean> {
    const wishList = await this.wishListRepository.findOneBy({
      id: wishListId,
      user: user,
    });

    if (!wishList) {
      return false;
    }
    return true;
  }
}
