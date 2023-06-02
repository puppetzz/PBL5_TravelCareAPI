import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/aws-s3/s3.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Account } from 'src/auth/entities/account.entity';
import { AddressService } from 'src/address/address.service';
import { PaginationResponse } from 'src/ultils/paginationResponse';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly addressService: AddressService,
    private readonly s3Service: S3Service,
  ) {}

  async getCurrentUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        accountId: id,
      },
      relations: {
        account: true,
        address: {
          country: true,
          province: true,
          district: true,
          ward: true,
        },
      },
    });

    return user;
  }

  async updateProfieImage(user: User, image: Express.Multer.File) {
    const { key, url } = await this.s3Service.uploadImage(image);

    console.log(user.profileImage);

    if (user.profileImage) {
      await this.s3Service.deleteImage(user.profileImage);
    }

    await this.userRepository.update(
      { accountId: user.accountId },
      {
        profileImage: key,
        profileImageUrl: url,
      },
    );

    return url;
  }

  async updateCoverImage(user: User, image: Express.Multer.File) {
    const { key, url } = await this.s3Service.uploadImage(image);

    if (user.coverImage) {
      await this.s3Service.deleteImage(user.coverImage);
    }

    await this.userRepository.update(
      { accountId: user.accountId },
      {
        coverImage: key,
        coverImageUrl: url,
      },
    );

    return url;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { accountId: id },
      relations: {
        account: true,
        address: true,
      },
    });

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.phoneNumber = updateUserDto.phoneNumber;
    user.about = updateUserDto.about;

    if (user.address) {
      const address = await this.addressService.updateAddress(
        user.address.id,
        updateUserDto.countryId,
        updateUserDto.provinceId,
        updateUserDto.districtId,
        updateUserDto.wardId,
        updateUserDto.streetAddress,
      );
      user.address = address;
    }

    if (user.address && !updateUserDto.countryId) {
      await this.addressService.deleteAddress(user.address.id);
      user.address = null;
    }

    if (!user.address && !!updateUserDto.countryId) {
      const address = await this.addressService.createAddress(
        updateUserDto.countryId,
        updateUserDto.provinceId,
        updateUserDto.districtId,
        updateUserDto.wardId,
        updateUserDto.streetAddress,
      );
      user.address = address;
    }

    const userUpdated = await this.userRepository.save(user);

    return userUpdated;
  }
  async getAllUsers(
    user: User,
    filterDto: FilterDto,
  ): Promise<{
    data: User[];
    pagination: PaginationResponse;
  }> {
    if (!this.checkRoleAdmin(user)) {
      throw new UnauthorizedException('User not Administrator');
    }
    const { search, page, limit } = filterDto;
    const users = await this.userRepository
      .createQueryBuilder('user')
      .take(limit)
      .skip((page - 1) * limit);
    if (search) {
      const searchLower = search.toLowerCase();
      users.where(
        `(CONCAT(LOWER(user.lastName), ', ', LOWER(user.firstName)  LIKE :name)`,
        { name: `%${searchLower}%` },
      );
    }
    const data = await users.getMany();

    const total = await this.userRepository.count();
    const totalPage = Math.ceil(total / limit);

    const pagination: PaginationResponse = {
      pageNumber: page,
      pageSize: limit,
      total: total,
      totalPage: totalPage,
    };
    return { data, pagination };
  }
  async checkRoleAdmin(user: User): Promise<boolean> {
    if (user.role.toString().toLowerCase().includes('admin')) {
      return true;
    }
    return false;
  }
}
