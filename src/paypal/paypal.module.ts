import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paypal } from './entities/paypal.entity';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { HttpModule } from '@nestjs/axios';
import { BookingModule } from 'src/booking/booking.module';
import { CurrencyExchangeService } from './currency-exchange.service';
import { ExchangeRate } from './entities/exchange-rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paypal, ExchangeRate]),
    forwardRef(() => HttpModule),
    forwardRef(() => BookingModule),
  ],
  controllers: [PaypalController],
  providers: [PaypalService, CurrencyExchangeService],
  exports: [
    TypeOrmModule.forFeature([Paypal, ExchangeRate]),
    PaypalService,
    CurrencyExchangeService,
  ],
})
export class PaypalModule {}
