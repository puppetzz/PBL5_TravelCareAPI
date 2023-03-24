import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Address } from '../address/entities/address.entity';
import { AddressModule } from '../address/address.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { S3Module } from '../aws-s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Address]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    }),
    AddressModule,
    S3Module,
  ],
  exports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
