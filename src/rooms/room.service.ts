import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { In, Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { RoomFeature } from './entities/room-feature.entity';
import { RoomType } from './entities/room-type.entity';
import { HotelService } from 'src/hotels/hotel.service';
import { User } from 'src/user/entities/user.entity';
import { RoomImage } from './entities/room-image.entity';
import { S3Service } from 'src/aws-s3/s3.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(RoomFeature)
    private roomFeatureRepository: Repository<RoomFeature>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(RoomImage)
    private roomImageRepository: Repository<RoomImage>,
    private readonly hotelService: HotelService,
    private readonly s3Service: S3Service,
  ) {}
  async createRoom(
    hotelId: string,
    createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    const hotelOwner = await this.hotelRepository.findOneBy({ id: hotelId });
    if (!hotelOwner) {
      throw new NotFoundException(`Hotel ${hotelId} not found`);
    }
    const {
      price,
      numberOfRooms,
      avaliableRooms,
      sleeps,
      isPrepay,
      discountIds,
      roomFeatureIds,
      roomTypeIds,
    } = createRoomDto;
    const createRoom = await this.roomRepository.create({
      hotel: hotelOwner,
      price,
      avaliableRooms,
      numberOfRooms,
      sleeps,
      isPrepay,
    });
    if (discountIds) {
      const discountEntities = await this.discountRepository.findBy({
        id: In(discountIds),
      });
      createRoom.discounts = discountEntities;
    }
    if (roomFeatureIds) {
      const roomFeatures = await this.roomFeatureRepository.findBy({
        id: In(roomFeatureIds),
      });
      createRoom.roomFeatures = roomFeatures;
    }
    if (roomTypeIds) {
      const roomTypes = await this.roomTypeRepository.findBy({
        id: In(roomTypeIds),
      });
      createRoom.roomTypes = roomTypes;
    }
    return await this.roomRepository.save(createRoom);
  }
  async getRoomsByHotelId(hotelId: string): Promise<Room[]> {
    const rooms = await this.roomRepository.find({
      where: {
        hotel: {
          id: hotelId,
        },
      },
      relations: ['discounts', 'roomTypes', 'roomFeatures', 'roomImages'],
    });
    return rooms;
  }
  async getRoomById(roomId: string): Promise<Room> {
    return this.roomRepository.findOne({
      where: {
        id: roomId,
      },
      relations: ['discounts', 'roomTypes', 'roomFeatures', 'roomImages'],
    });
  }
  async deleteRoomById(roomId: string, user: User): Promise<void> {
    const hotel = await this.hotelRepository.findOne({
      where: {
        rooms: {
          id: roomId,
        },
      },
    });
    if (!(await this.hotelService.checkIfOwner(hotel.id, user))) {
      throw new UnauthorizedException('User is not owner of this hotel');
    }
    await this.roomRepository.delete(roomId);
  }
  async uploadImages(
    roomId: string,
    files: Express.Multer.File[],
  ): Promise<RoomImage[]> {
    const resImages = [];
    if (files) {
      const room = await this.roomRepository.findOneBy({
        id: roomId,
      });
      if (!room) {
        throw new NotFoundException(`Room ${room.id} not found`);
      }
      for (const image of files) {
        const { key, url } = await this.s3Service.uploadImage(image);
        const roomImage = await this.roomImageRepository.create({
          imageKey: key,
          imageUrl: url,
          room: room,
        });
        await this.roomImageRepository.save(roomImage);
        resImages.push(roomImage);
      }
    }
    return resImages;
  }
}
