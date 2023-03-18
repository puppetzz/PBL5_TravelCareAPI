import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username is require!' })
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty({ message: 'Password is require!' })
  @IsString()
  @ApiProperty()
  password: string;
}
