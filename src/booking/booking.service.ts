import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/user/entities/user.entity';
import { MoreThan } from 'typeorm/find-options/operator/MoreThan';
import { Room } from 'src/rooms/entities/room.entity';
import { BookingDto } from './dto/booking.dto';
import { BookingRoom } from './entities/booking-room.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BookingService {
  private readonly baseURL = {
    sandbox: 'https://api-m.sandbox.paypal.com',
    production: 'https://api-m.paypal.com',
  };

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(BookingRoom)
    private readonly BookingRoomRepository: Repository<BookingRoom>,
  ) {}

  async getBookings(): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find();

    return bookings;
  }

  async getBookingswithCurrentUser(user: User): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      where: {
        user: {
          accountId: user.accountId,
        },
        checkOut: MoreThan(new Date()),
      },
      relations: {
        user: {
          account: true,
        },
        bookingRooms: {
          room: {
            hotel: {
              location: {
                address: {
                  country: true,
                  province: true,
                  district: true,
                  ward: true,
                },
              },
            },
          },
        },
      },
      select: {
        user: {
          accountId: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          account: {
            id: true,
            username: true,
          },
        },
      },
      order: {
        createAt: 'DESC',
      },
    });

    return bookings;
  }

  async getBookingById(user: User, bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
        user: {
          accountId: user.accountId,
        },
      },
      relations: {
        user: {
          account: true,
        },
        bookingRooms: {
          room: {
            hotel: {
              location: {
                address: {
                  country: true,
                  province: true,
                  district: true,
                  ward: true,
                },
              },
            },
          },
        },
      },
      select: {
        user: {
          accountId: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          account: {
            id: true,
            username: true,
          },
        },
      },
      order: {
        createAt: 'DESC',
      },
    });

    return booking;
  }

  async createBooking(
    user: User,
    bookingDto: BookingDto,
    payment: boolean,
  ): Promise<Booking> {
    const checkIn = new Date(bookingDto.checkIn);
    const checkOut = new Date(bookingDto.checkOut);

    const nights = this.numberOfNightsBetweenDates(checkIn, checkOut);

    let totalAmount = 0;

    if (checkIn < new Date()) throw new BadRequestException('Invalid Date!');

    if (checkIn > checkOut) throw new BadRequestException('Invalid Date!');

    const bookingRooms = [];
    let isSuccess = true;

    for (const curRoom of bookingDto.rooms) {
      const room = await this.roomRepository.findOne({
        where: {
          id: curRoom.roomId,
        },
      });

      const availableRooms = await this.getAvailablesRoom(
        curRoom.roomId,
        checkIn,
        checkOut,
      );

      if (!room) throw new BadRequestException('room does not exist!');

      if (availableRooms <= 0)
        throw new BadRequestException('No room available!');

      if (curRoom.numberOfRooms > availableRooms)
        throw new BadRequestException('Not enough rooms available!');

      if (room.availableRooms <= 0)
        throw new BadRequestException('No room available!');

      if (payment === false)
        if (room.isPrepay)
          throw new BadRequestException('Room must be prepay!');

      if (curRoom.numberOfRooms > room.numberOfRooms)
        throw new BadRequestException('Not enough rooms available!');

      if (room.isPrepay) isSuccess = false;

      const bookingRoom = this.BookingRoomRepository.create({
        numberOfRooms: curRoom.numberOfRooms,
        room: room,
      });

      await this.BookingRoomRepository.save(bookingRoom);

      totalAmount += room.price * curRoom.numberOfRooms * nights;

      bookingRooms.push(bookingRoom);
    }

    const booking = this.bookingRepository.create({
      checkIn: checkIn,
      checkOut: checkOut,
      CustomerName: bookingDto.customerName,
      user: user,
      isSuccess: isSuccess,
      bookingRooms: bookingRooms,
      totalAmount: totalAmount,
    });

    const newBooking = await this.bookingRepository.save(booking);

    return newBooking;
  }

  async cancelBooking(user: User, bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
      },
      relations: {
        user: true,
        bookingRooms: {
          room: true,
        },
        paypal: true,
      },
    });

    if (booking.user.accountId != user.accountId)
      throw new BadRequestException(
        'You must be the owner of the booking to cancel the booking!',
      );

    if (booking.isPaid) {
      const accessToken = await this.generateAccessToken();
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            `${this.baseURL.sandbox}/v2/payments/captures/${booking.paypal.transactionId}/refund`,
            null,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
          .pipe(
            catchError((e) => {
              throw new HttpException(e.response.data, e.response.status);
            }),
          ),
      );

      if (!data) throw new BadRequestException('Refund failed!');
    }

    const deleteResult = await this.bookingRepository.delete({
      id: booking.id,
    });
    if (deleteResult.affected >= 1) {
      return 'Cancel Successfully!';
    }
    return 'Cancel failed!';
  }

  private numberOfNightsBetweenDates(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let dayCount = 0;

    while (end > start) {
      dayCount++;
      start.setDate(start.getDate() + 1);
    }

    return dayCount;
  }

  async getAvailablesRoom(roomId: string, checkIn: Date, checkOut: Date) {
    if (checkIn >= checkOut)
      throw new BadRequestException(
        'Check out date must be more than check out date!',
      );

    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) throw new BadRequestException('Room not exist!');

    const bookings = await this.bookingRepository.find({
      where: [
        {
          bookingRooms: {
            room: {
              id: roomId,
            },
          },
          checkIn: Raw(
            (alias) =>
              `NOT (CAST(${alias} AS DATE) > '${checkIn.toISOString()}' AND CAST(${alias} AS DATE) >= '${checkOut.toISOString()}') AND CAST(${alias} AS DATE) > '${checkIn.toISOString()}'`,
          ),
        },
        {
          bookingRooms: {
            room: {
              id: roomId,
            },
          },
          checkOut: Raw(
            (alias) =>
              `NOT (CAST(${alias} AS DATE) <= '${checkIn.toISOString()}' AND CAST(${alias} AS DATE) < '${checkOut.toISOString()}') AND CAST(${alias} AS DATE) < '${checkOut.toISOString()}'`,
          ),
        },
        {
          bookingRooms: {
            room: {
              id: roomId,
            },
          },
          checkIn: MoreThanOrEqual(checkIn),
          checkOut: LessThanOrEqual(checkOut),
        },
      ],
      relations: {
        bookingRooms: {
          room: true,
        },
      },
    });

    if (!bookings) return room.numberOfRooms;

    const unavailableRooms = bookings.reduce(
      (accumulator: number, currentValue) =>
        accumulator +
        currentValue.bookingRooms.reduce((acc: number, curr) => {
          if (curr.room.id === roomId) return acc + curr.numberOfRooms;
        }, 0),
      0,
    );

    return room.numberOfRooms - unavailableRooms;
  }

  private async generateAccessToken() {
    const auth = Buffer.from(
      process.env.PAYPAL_cLIENT_ID + ':' + process.env.PAYPAL_APP_SECRET_KEY,
    ).toString('base64');

    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.baseURL.sandbox}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      ),
    );
    return data.access_token;
  }
}
