import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Province } from './province.entity';
import { Address } from './address.entity';
import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Ward } from './ward.entity';

@Entity()
export class District {
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

  @ManyToOne(() => Province, (province) => province.districts, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsDefined()
  province: Province;

  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];

  @OneToMany(() => Address, (address) => address.district)
  addresses: Address[];
}
