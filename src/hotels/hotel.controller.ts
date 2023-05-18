import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { RoomService } from 'src/rooms/room.service';
import { Room } from 'src/rooms/entities/room.entity';
import { CreateRoomDto } from 'src/rooms/dto/createRoom.dto';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('hotels')
@ApiTags('Hotel')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: RoomService,
  ) {}
  @Post('/:hotelId/rooms')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  async createRoomForHotel(
    @Param('hotelId') hotelId: string,
    @Body() createRoomDto: CreateRoomDto,
    @GetCurrentAccount() user: User,
  ): Promise<Room> {
    if (!(await this.hotelService.checkIfOwner(hotelId, user))) {
      throw new UnauthorizedException('User is not owner of this hotel');
    }
    return this.roomService.createRoom(hotelId, createRoomDto);
  }

  @Get('/:hotelId/rooms')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get rooms of hotel' })
  async getRoomsOfHotel(@Param('hotelId') hotelId: string): Promise<Room[]> {
    return this.roomService.getRoomsByHotelId(hotelId);
  }
}
