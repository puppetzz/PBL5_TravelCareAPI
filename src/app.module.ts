import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './locations/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AddressModule,
    AuthModule,
    LocationModule,
  ],
})
export class AppModule {}
