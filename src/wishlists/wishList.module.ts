import { Module } from '@nestjs/common';
import { WishlistService } from './wishList.service';
import { WishlistController } from './wishList.controller';

@Module({
  providers: [WishlistService],
  controllers: [WishlistController],
})
export class WishlistModule {}
