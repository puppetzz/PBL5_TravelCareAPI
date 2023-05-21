import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  firstName: string;

  @ApiProperty({ required: true })
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  about: string;

  @ApiProperty()
  countryId: string;

  @ApiProperty()
  provinceId: string;

  @ApiProperty()
  districtId: string;

  @ApiProperty()
  wardId: string;

  @ApiProperty()
  streetAddress: string;
}
