import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { BookingService } from './booking.service';
import { User } from 'src/user/entities/user.entity';
import { Booking } from './entities/booking.entity';
import { BookingDto } from './dto/booking.dto';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: Booking, isArray: true })
  @UseGuards(AccessTokenGuard)
  getBookingWithCurrentUser(@GetCurrentAccount() user: User) {
    return this.bookingService.getBookingswithCurrentUser(user);
  }

  @Get('booking-by-id/:bookingId')
  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: Booking })
  @ApiParam({ name: 'bookingId', type: String })
  @UseGuards(AccessTokenGuard)
  getBookingById(
    @GetCurrentAccount() user: User,
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.getBookingById(user, bookingId);
  }

  @Post()
  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: Booking })
  @UseGuards(AccessTokenGuard)
  bookRoom(@GetCurrentAccount() user: User, @Body() bookingDto: BookingDto) {
    return this.bookingService.createBooking(user, bookingDto, false);
  }

  @Delete()
  @ApiSecurity('JWT-auth')
  @ApiOkResponse({ type: String })
  @UseGuards(AccessTokenGuard)
  cancelBooking(
    @GetCurrentAccount() user: User,
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.cancelBooking(user, bookingId);
  }
}
