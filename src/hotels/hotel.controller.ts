import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
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
import { FilterDto } from './dto/filter.dto';
import { HotelResponse } from './types/response-hotel.type';
import { FilterRoomDto } from 'src/rooms/dto/filter-room.dto';

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
    return this.roomService.createRoom(hotelId, createRoomDto);
  }

  @Get('/:hotelId/rooms')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get rooms of hotel' })
  async getRoomsOfHotel(
    @Param('hotelId') hotelId: string,
    @Query(ValidationPipe) filterRoomDto: FilterRoomDto,
  ): Promise<Room[]> {
    return this.roomService.getRoomsByHotelId(hotelId, filterRoomDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all hotels' })
  async getAllhotels(
    @Query(ValidationPipe) filterDto: FilterDto,
  ): Promise<HotelResponse> {
    return this.hotelService.getAllHotels(filterDto);
  }

  @Get('/:hotelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get hotel by Id' })
  async getHotelById(@Param('hotelId') id: string): Promise<Hotel> {
    return this.hotelService.getHotelById(id);
  }
  @Patch('/:hotelId/register')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'register hotel by Owner' })
  async registerHotelForOwner(
    @Param('hotelId') id: string,
    @GetCurrentAccount() user: User,
  ): Promise<Hotel> {
    return this.hotelService.registerHotelForOwner(user, id);
  }
  @Delete('/:hotelId')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete hotel by Owner' })
  async deleteHotelById(
    @Param('hotelId') id: string,
    @GetCurrentAccount() user: User,
  ): Promise<void> {
    return this.hotelService.deleteHotel(id, user);
  }
}
