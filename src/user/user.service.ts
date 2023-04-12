import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/aws-s3/s3.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  async getCurrentUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        accountId: id,
      },
      relations: {
        account: true,
      },
    });

    const profileImage = user.profileImage
      ? await this.s3Service.generatePresignedUrl(user.profileImage)
      : null;

    const coverImage = user.coverImage
      ? await this.s3Service.generatePresignedUrl(user.coverImage)
      : null;

    user.profileImage = profileImage;
    user.coverImage = coverImage;

    console.log(user);
    return user;
  }
}
