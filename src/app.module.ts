import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './locations/location.module';
import { CategoryModule } from './locations/category.module';
import { HotelModule } from './hotels/hotels.module';
import { RoomModule } from './rooms/room.module';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './reviews/review.module';
import { WishlistModule } from './wishlists/wishList.module';
import { HotelStyleModule } from './hotels/hotel-style.module';
import { PropertyAmenityModule } from './hotels/property-amenity.module';
import { RoomTypeModule } from './rooms/room-type.module';
import { RoomFeatureModule } from './rooms/room-feature.module';
import { DiscountModule } from './rooms/discount.module';
import { BedModule } from './rooms/bed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AddressModule,
    AuthModule,
    LocationModule,
    CategoryModule,
    HotelModule,
    RoomModule,
    RoomTypeModule,
    RoomFeatureModule,
    DiscountModule,
    BookingModule,
    ReviewModule,
    WishlistModule,
    HotelStyleModule,
    PropertyAmenityModule,
    BedModule,
  ],
})
export class AppModule {}
