import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cashify } from 'cashify';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';

@Injectable()
export class CurrencyExchangeService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  async getExchangeRate() {
    const { data } = await firstValueFrom(
      this.httpService.get(
        'https://openexchangerates.org/api/latest.json?app_id=561fe4bb169a4f1cb95172c6d8a94194',
      ),
    );
    const res = {
      USD: data.rates.USD,
      VND: data.rates.VND,
    };

    return res;
  }

  async currencyExchange(amount: number) {
    const exchangeRate = (await this.exchangeRateRepository.find())[0];

    if (this.isMoreThan12HoursAgo(exchangeRate.date)) {
      const currentExchangeRate = await this.getExchangeRate();

      exchangeRate.USD = currentExchangeRate.USD;
      exchangeRate.VND = currentExchangeRate.VND;
      exchangeRate.date = new Date();

      await this.exchangeRateRepository.save(exchangeRate);
    }

    const rates = {
      USD: exchangeRate.USD,
      VND: exchangeRate.VND,
    };

    const cashify = new Cashify({ base: 'USD', rates });

    return cashify.convert(amount, { from: 'VND', to: 'USD' });
  }

  private isMoreThan12HoursAgo(date: Date): boolean {
    const currentTime = new Date().getTime();

    const saveDateTime = new Date(date).getTime();

    const twelveHoursInMillis = 12 * 60 * 60 * 1000;

    return currentTime - saveDateTime > twelveHoursInMillis;
  }
}
