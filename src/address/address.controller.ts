import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Ward } from './entities/ward.entity';

@Controller('address')
@ApiTags('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('all')
  @ApiOkResponse({ type: Country, isArray: true })
  getAll(): Promise<Country[]> {
    return this.addressService.getAll();
  }

  @Get('countries')
  @ApiOkResponse({ type: Country, isArray: true })
  getAllCountry(): Promise<Country[]> {
    return this.addressService.getAllCountry();
  }

  @Get('provinces/:countryId')
  @ApiOkResponse({ type: Province, isArray: true })
  @ApiParam({ name: 'countryId', required: true })
  getProvinceByCountry(
    @Param('countryId') countryId: string,
  ): Promise<Province[]> {
    return this.addressService.getProvinceByCountry(countryId);
  }

  @Get('districts/:provinceId')
  @ApiOkResponse({ type: District, isArray: true })
  @ApiParam({ name: 'provinceId', required: true })
  getDitrictByProvince(
    @Param('provinceId') provinceId: string,
  ): Promise<District[]> {
    return this.addressService.getDistrictByProvince(provinceId);
  }

  @Get('wards/:districtId')
  @ApiOkResponse({ type: Ward, isArray: true })
  @ApiParam({ name: 'districtId', required: true })
  getWardByDistrict(@Param('districtId') districtid: string): Promise<Ward[]> {
    return this.addressService.getWardByDistrict(districtid);
  }
}
