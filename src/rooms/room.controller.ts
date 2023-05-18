import { Controller, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Room } from './entities/room.entity';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('rooms')
@ApiTags('Room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/:roomId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get rooms by roomId' })
  async getRoomsOfHotel(@Param('roomId') roomId: string): Promise<Room> {
    return this.roomService.getRoomById(roomId);
  }

  @Delete('/:roomId')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'delete room by roomId' })
  async deleteRoomById(
    @Param('roomId') roomId: string,
    @GetCurrentAccount() user: User,
  ): Promise<void> {
    return this.roomService.deleteRoomById(roomId, user);
  }
}
