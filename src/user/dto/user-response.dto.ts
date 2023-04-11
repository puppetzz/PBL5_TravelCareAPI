import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/address/entities/address.entity';

export class UserResponeDTO {
  userame: string;
  email: string;
  address: Address;
  createAt: Date;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImage: string;
  coverImage: string;
}
