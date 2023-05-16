import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { Discount } from './entities/discount.entity';

@Controller('discounts')
@ApiTags('Discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}
  @Get()
  getDiscounts(): Promise<Discount[]> {
    return this.discountService.getDiscount();
  }
}
