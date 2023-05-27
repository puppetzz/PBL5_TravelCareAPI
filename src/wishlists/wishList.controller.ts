import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishList.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WishList } from './wishList.entity';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from 'src/user/entities/user.entity';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
@Controller('wishlists')
@ApiTags('Wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get wishlist of user' })
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  async getWishListOfUser(
    @GetCurrentAccount() user: User,
  ): Promise<WishList[]> {
    return this.wishlistService.getWishListByUser(user);
  }

  @Delete('/:wishListId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete wishlist by user' })
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  async deleteWishlist(
    @GetCurrentAccount() user: User,
    @Param('wishListId') wishListId: string,
  ): Promise<void> {
    console.log(wishListId + ' deleted');

    return this.wishlistService.deleteWishList(user, wishListId);
  }
}
