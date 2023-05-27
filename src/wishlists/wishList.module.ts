import { Module } from '@nestjs/common';
import { WishlistService } from './wishList.service';
import { WishlistController } from './wishList.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './wishList.entity';
import { Location } from 'src/locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishList, Location])],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService],
})
export class WishlistModule {}
