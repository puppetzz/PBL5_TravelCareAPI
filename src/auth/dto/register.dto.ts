import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsAlphanumeric()
  @IsNotEmpty({ message: 'username is require!' })
  @ApiProperty()
  @MinLength(3, { message: 'username must be longer than 3 characters!' })
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email is require' })
  @ApiProperty()
  email: string;

  @MinLength(6, { message: 'Password must be longer than 6 characters!' })
  @IsNotEmpty({ message: 'password is require' })
  @ApiProperty()
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'firstName is required!' })
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'lastName is required!' })
  lastName: string;

  @ApiProperty({ required: false })
  phoneNumber: string;

  @ApiProperty({ required: false })
  countryId: string;

  @ApiProperty({ required: false })
  provinceId: string;

  @ApiProperty({ required: false })
  districtId: string;

  @ApiProperty({ required: false })
  wardId: string;

  @ApiProperty({ required: false })
  streetAddress: string;

  @ApiProperty({ required: false })
  image: string;
}
