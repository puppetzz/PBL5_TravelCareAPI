import { Column, PrimaryColumn, OneToMany, Entity } from 'typeorm';
import { Province } from './province.entity';
import { Address } from './address.entity';
import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Country {
  @PrimaryColumn({ length: 10 })
  @ApiProperty()
  id: string;

  @Column()
  @IsDefined()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @OneToMany(() => Province, (province) => province.country)
  provinces: Province[];

  @OneToMany(() => Address, (address) => address.country)
  addresses: Address[];
}
