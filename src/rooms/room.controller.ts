import { Controller, Delete, Patch, UploadedFiles } from '@nestjs/common';
import { RoomService } from './room.service';
import {
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Room } from './entities/room.entity';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from 'src/user/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiMultiFile } from 'src/ultils/imagesSwagger';
import { RoomDto } from './dto/room.dto';

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

  @Patch('/:roomId')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update room by roomId' })
  async updateRoom(
    @Param('roomId') roomId: string,
    @GetCurrentAccount() user: User,
    @Body() updateRoomDto: RoomDto,
  ): Promise<Room> {
    return this.roomService.updateRoom(roomId, updateRoomDto, user);
  }

  @Post('/:roomId/uploadImages')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload images for room' })
  @ApiMultiFile('images')
  @UseInterceptors(FilesInterceptor('images'))
  uploadMultipleFiles(
    @UploadedFiles() files: any,
    @Param('roomId') roomId: string,
    @GetCurrentAccount() user: User,
  ) {
    return this.roomService.uploadImages(roomId, files, user);
  }

  @Delete('/:roomId/deleteImages/:roomImageId')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'delete images for room' })
  deleteRoomImages(
    @GetCurrentAccount() user: User,
    @Param('roomId') roomId: string,
    @Param('roomImageId') roomImageId: string,
  ) {
    return this.roomService.deleteRoomImage(roomImageId, roomId, user);
  }
}
