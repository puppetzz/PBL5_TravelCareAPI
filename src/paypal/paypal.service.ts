import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, firstValueFrom } from 'rxjs';
import { BookingService } from 'src/booking/booking.service';
import { BookingDto } from 'src/booking/dto/booking.dto';
import { Booking } from 'src/booking/entities/booking.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CurrencyExchangeService } from './currency-exchange.service';
import { Paypal } from './entities/paypal.entity';

@Injectable()
export class PaypalService {
  private readonly baseURL = {
    sandbox: 'https://api-m.sandbox.paypal.com',
    production: 'https://api-m.paypal.com',
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly currencyExchangeService: CurrencyExchangeService,
    private readonly bookingService: BookingService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Paypal)
    private readonly paypalRepository: Repository<Paypal>,
  ) {}

  async createOrder(user: User, bookingDto: BookingDto) {
    const accessToken = await this.generateAccessToken();

    const booking = await this.bookingService.createBooking(
      user,
      bookingDto,
      true,
    );

    const amount = await this.currencyExchangeService.currencyExchange(
      booking.totalAmount,
    );

    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.baseURL.sandbox}/v2/checkout/orders`,
          JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
              {
                reference_id: booking.id,
                amount: {
                  currency_code: 'USD',
                  value: amount.toFixed(2),
                },
              },
            ],
          }),
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

    return data;
  }

  async capturePayment(orderId: string) {
    const accessToken = await this.generateAccessToken();
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`,
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

    const bookingId = data.purchase_units[0].reference_id;

    const booking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
      },
    });

    booking.isSuccess = true;
    booking.isPaid = true;

    if (!booking) throw new BadRequestException('Booking does not exist!');

    const paypal = this.paypalRepository.create({
      transactionId: data.purchase_units[0].payments.captures[0].id,
      booking: booking,
    });

    await this.paypalRepository.save(paypal);

    await this.bookingRepository.save(booking);

    const newBooking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
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
    });

    return newBooking;
  }

  async refundPayment(captureId: string) {
    const accessToken = await this.generateAccessToken();
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.baseURL.sandbox}/v2/payments/captures/${captureId}/refund`,
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

    return data;
  }

  async getCapturedPaymentDetails(captureId: string) {
    const accessToken = await this.generateAccessToken();
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${this.baseURL.sandbox}/v2/payments/captures/${captureId}`, {
          headers: {
            contentType: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
        ),
    );

    return data;
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
