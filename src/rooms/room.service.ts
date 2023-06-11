import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomDto } from './dto/room.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { RoomFeature } from './entities/room-feature.entity';
import { RoomType } from './entities/room-type.entity';
import { HotelService } from 'src/hotels/hotel.service';
import { User } from 'src/user/entities/user.entity';
import { RoomImage } from './entities/room-image.entity';
import { S3Service } from 'src/aws-s3/s3.service';
import { Bed } from './entities/bed.entity';
import { RoomBed } from './entities/room-bed.entity';
import { BookingService } from 'src/booking/booking.service';
import { FilterRoomDto } from './dto/filter-room.dto';

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
    @InjectRepository(Bed)
    private bedRepository: Repository<Bed>,
    @InjectRepository(RoomBed)
    private roomBedRepository: Repository<RoomBed>,
    private readonly hotelService: HotelService,
    private readonly s3Service: S3Service,
    private readonly bookingService: BookingService,
  ) {}
  async createRoom(hotelId: string, createRoomDto: RoomDto): Promise<Room> {
    const hotelOwner = await this.hotelRepository.findOneBy({ id: hotelId });
    if (!hotelOwner) {
      throw new NotFoundException(`Hotel ${hotelId} not found`);
    }
    const {
      price,
      numberOfRooms,
      availableRooms,
      sleeps,
      isPrepay,
      isFreeCancellation,
      freeCancellationPeriod,
      discountIds,
      roomFeatureIds,
      roomTypeIds,
      roomBeds,
    } = createRoomDto;
    const createRoom = this.roomRepository.create({
      hotel: hotelOwner,
      price,
      availableRooms,
      numberOfRooms,
      sleeps,
      isPrepay,
      isFreeCancellation,
      freeCancellationPeriod,
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
    const newRoom = await this.roomRepository.save(createRoom);

    if (roomBeds) {
      for (const roomBed of roomBeds) {
        const bed = await this.bedRepository.findOneBy({
          id: roomBed.bedId,
        });
        if (!bed) {
          throw new NotFoundException(`Bed ${roomBed.bedId} does not exist`);
        }
        const newRoomBed = this.roomBedRepository.create({
          bed: bed,
          numberOfBeds: roomBed.numberOfBed,
          room: newRoom,
        });
        await this.roomBedRepository.save(newRoomBed);
      }
    }
    return this.roomRepository.findOne({
      where: {
        id: newRoom.id,
      },
      relations: {
        discounts: true,
        roomTypes: true,
        roomFeatures: true,
        roomImages: true,
        roomBeds: {
          bed: true,
        },
      },
    });
  }
  async updateRoom(
    roomId: string,
    updateRoomDto: RoomDto,
    user: User,
  ): Promise<Room> {
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
    const room = await this.roomRepository.findOneBy({
      id: roomId,
    });
    if (!room) {
      throw new NotFoundException(`Room ${room.id} not found`);
    }
    const {
      price,
      numberOfRooms,
      availableRooms,
      sleeps,
      isPrepay,
      discountIds,
      isFreeCancellation,
      freeCancellationPeriod,
      roomFeatureIds,
      roomTypeIds,
      roomBeds,
    } = updateRoomDto;
    room.price = price;
    room.numberOfRooms = numberOfRooms;
    room.availableRooms = availableRooms;
    room.sleeps = sleeps;
    room.isPrepay = isPrepay;
    room.isFreeCancellation = isFreeCancellation;
    room.freeCancellationPeriod = freeCancellationPeriod;
    if (discountIds) {
      const discountEntities = await this.discountRepository.findBy({
        id: In(discountIds),
      });
      room.discounts = discountEntities;
    }
    if (roomFeatureIds) {
      const roomFeatures = await this.roomFeatureRepository.findBy({
        id: In(roomFeatureIds),
      });
      room.roomFeatures = roomFeatures;
    }
    if (roomTypeIds) {
      const roomTypes = await this.roomTypeRepository.findBy({
        id: In(roomTypeIds),
      });
      room.roomTypes = roomTypes;
    }
    await this.roomRepository.save(room);

    if (roomBeds) {
      room.roomBeds = null;
      await this.roomRepository.save(room);
      for (const roomBed of roomBeds) {
        const bed = await this.bedRepository.findOneBy({
          id: roomBed.bedId,
        });
        if (!bed) {
          throw new NotFoundException(`Bed ${roomBed.bedId} does not exist`);
        }
        const newRoomBed = this.roomBedRepository.create({
          bed: bed,
          numberOfBeds: roomBed.numberOfBed,
          room: room,
        });

        await this.roomBedRepository.save(newRoomBed);
      }
    }
    return this.getRoomById(roomId);
  }
  async getRoomsByHotelId(
    hotelId: string,
    filterRoomDto: FilterRoomDto,
  ): Promise<Room[]> {
    const sleeps = filterRoomDto.sleeps ? filterRoomDto.sleeps : 0;

    const rooms = await this.roomRepository.find({
      where: {
        hotel: {
          id: hotelId,
        },
        sleeps: MoreThanOrEqual(sleeps),
      },
      relations: {
        discounts: true,
        roomTypes: true,
        roomFeatures: true,
        roomImages: true,
        roomBeds: {
          bed: true,
        },
      },
    });

    if (
      filterRoomDto.checkIn &&
      filterRoomDto.checkOut &&
      filterRoomDto.numberOfRooms
    ) {
      const checkIn = new Date(filterRoomDto.checkIn);
      const checkOut = new Date(filterRoomDto.checkOut);

      const res = [];

      for (const room of rooms) {
        const availableRooms = await this.bookingService.getAvailablesRoom(
          room.id,
          checkIn,
          checkOut,
        );

        room.availableRooms = availableRooms;

        if (availableRooms >= filterRoomDto.numberOfRooms) {
          res.push(room);
        }
      }

      return res;
    }

    return rooms;
  }
  async getRoomById(roomId: string): Promise<Room> {
    return this.roomRepository.findOne({
      where: {
        id: roomId,
      },
      relations: {
        discounts: true,
        roomTypes: true,
        roomFeatures: true,
        roomImages: true,
        roomBeds: {
          bed: true,
        },
      },
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
    const room = await this.roomRepository.findOne({
      relations: {
        roomBeds: true,
      },
      where: {
        id: roomId,
      },
    });
    for (const roomBed of room?.roomBeds) {
      await this.roomBedRepository.delete(roomBed.id);
    }
    await this.roomRepository.delete(roomId);
  }
  async uploadImages(
    roomId: string,
    files: Express.Multer.File[],
    user: User,
  ): Promise<Room> {
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
      }
    }
    return this.getRoomById(roomId);
  }
  async deleteRoomImage(
    roomImageId: string,
    roomId: string,
    user: User,
  ): Promise<Room> {
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

    await this.roomImageRepository.delete(roomImageId);
    return this.getRoomById(roomId);
  }
}
