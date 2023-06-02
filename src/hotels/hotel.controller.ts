import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { RoomService } from 'src/rooms/room.service';
import { Room } from 'src/rooms/entities/room.entity';
import { RoomDto } from 'src/rooms/dto/room.dto';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from 'src/user/entities/user.entity';
import { Hotel } from './entities/hotel.entity';
import { PaginationDto } from './dto/pagination.dto';
import { defaultPage, defaultLimit } from '../constant/constant';
import { PaginationResponse } from 'src/ultils/paginationResponse';

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
    @Body() createRoomDto: RoomDto,
    @GetCurrentAccount() user: User,
  ): Promise<Room> {
    if (!(await this.hotelService.checkIfOwner(hotelId, user))) {
      throw new UnauthorizedException('User is not owner of this hotel');
    }
    console.log(typeof createRoomDto.roomBeds);

    return this.roomService.createRoom(hotelId, createRoomDto);
  }

  @Get('/:hotelId/rooms')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get rooms of hotel' })
  async getRoomsOfHotel(@Param('hotelId') hotelId: string): Promise<Room[]> {
    return this.roomService.getRoomsByHotelId(hotelId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all hotels' })
  async getAllhotels(
    @Query(ValidationPipe) paginationDto: PaginationDto,
  ): Promise<{ data: Hotel[]; pagination: PaginationResponse }> {
    const { page = defaultPage, limit = defaultLimit } = paginationDto;
    return this.hotelService.getAllHotels({ page, limit });
  }

  @Get('/:hotelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get hotel by Id' })
  async getHotelById(@Param('hotelId') id: string): Promise<Hotel> {
    return this.hotelService.getHotelById(id);
  }
}
