import { PrimaryColumn, Column, ManyToOne, Entity, OneToMany } from 'typeorm';
import { Country } from './country.entity';
import { District } from './district.entity';
import { Address } from './address.entity';
import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Province {
  @PrimaryColumn({ length: 10 })
  @ApiProperty()
  id: string;

  @Column({ nullable: false })
  @IsDefined()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @ManyToOne(() => Country, (country) => country.provinces, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsDefined()
  country: Country;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];

  @OneToMany(() => Address, (address) => address.province)
  addresses: Address[];
}
