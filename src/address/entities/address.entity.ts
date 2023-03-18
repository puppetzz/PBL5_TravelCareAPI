import { Column, PrimaryColumn, ManyToOne, OneToOne, Entity } from 'typeorm';
import { Country } from './country.entity';
import { Province } from './province.entity';
import { District } from './district.entity';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Address {
  @PrimaryColumn({ length: 10 })
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
    nullable: false,
  })
  @IsNotEmpty({ message: 'Province should not empty' })
  @ApiProperty({ type: () => Province })
  province: Province;

  @ManyToOne(() => District, (district) => district.addresses, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsNotEmpty({ message: 'District should not empty' })
  @ApiProperty({ type: District })
  district: District;

  @Column()
  @ApiProperty()
  streetAddress: string;

  @OneToOne(() => User, (user) => user.address, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
