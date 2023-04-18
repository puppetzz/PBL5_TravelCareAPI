import {
  Column,
  ManyToOne,
  OneToOne,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { Province } from './province.entity';
import { District } from './district.entity';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../locations/entities/location.entity';
import { Ward } from './ward.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => Country, (country) => country.addresses, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsNotEmpty({ message: 'Country should not empty' })
  @ApiProperty({ type: () => Country })
  country: Country;

  @ManyToOne(() => Province, (province) => province.addresses, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @ApiProperty({ type: () => Province })
  province: Province;

  @ManyToOne(() => District, (district) => district.addresses, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @ApiProperty({ type: () => District })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.addresses, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @ApiProperty({ type: () => Ward })
  ward: Ward;

  @Column({ nullable: true })
  @ApiProperty()
  streetAddress: string;

  @OneToOne(() => User, (user) => user.address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToOne(() => Location, (location) => location.address)
  location: Location;
}
