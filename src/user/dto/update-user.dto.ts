import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

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
