import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CurrencyExchangeService } from './currency-exchange.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetCurrentAccount } from 'src/auth/decorators/get-current-account.decorator';
import { User } from 'src/user/entities/user.entity';
import { BookingDto } from 'src/booking/dto/booking.dto';

@Controller('paypal')
@ApiTags('paypal')
export class PaypalController {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  @Post('create-paypal-order')
  @ApiSecurity('JWT-auth')
  @UseGuards(AccessTokenGuard)
  async createPayment(
    @GetCurrentAccount() user: User,
    @Body() bookingDto: BookingDto,
  ): Promise<string> {
    return this.paypalService.createOrder(user, bookingDto);
  }

  @Post('capture-paypal-order/:orderId')
  @ApiParam({ name: 'orderId', type: String })
  async capturePayment(@Param('orderId') orderId: string) {
    console.log(orderId);
    return this.paypalService.capturePayment(orderId);
  }

  @Post('refund-captured-payment/:captureId')
  async refundCapture(@Param('captureId') captureId: string) {
    return this.paypalService.refundPayment(captureId);
  }

  @Get('get/:captureId')
  @ApiParam({ name: 'captureId', type: String })
  async getTransaction(@Param('captureId') captureId: string) {
    return this.paypalService.getCapturedPaymentDetails(captureId);
  }

  @Get('test/:amount')
  @ApiParam({ name: 'amount', type: 'number' })
  test(@Param('amount') amount: number) {
    return this.currencyExchangeService.currencyExchange(amount);
  }
}
