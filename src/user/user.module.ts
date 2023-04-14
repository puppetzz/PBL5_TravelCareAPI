import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { S3Module } from 'src/aws-s3/s3.module';
import { AddressModule } from 'src/address/address.module';
import { Account } from 'src/auth/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account]), S3Module, AddressModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
