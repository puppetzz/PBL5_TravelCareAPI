import { forwardRef, Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Address } from 'src/address/entities/address.entity';
import { Category } from './entities/category.entity';
import { AddressModule } from 'src/address/address.module';
import { S3Module } from 'src/aws-s3/s3.module';
import { User } from 'src/user/entities/user.entity';
import { LocationImage } from './entities/location-image.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { HotelStyle } from 'src/hotels/entities/hotel-style.entity';
import { PropertyAmenity } from 'src/hotels/entities/property-amenity.entity';
import { WishlistModule } from 'src/wishlists/wishList.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location,
      Address,
      Category,
      User,
      LocationImage,
      Hotel,
      HotelStyle,
      PropertyAmenity,
    ]),
    AddressModule,
    S3Module,
    WishlistModule,
    forwardRef(() => UserModule),
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [TypeOrmModule.forFeature([Location, Category, LocationImage])],
})
export class LocationModule {}
