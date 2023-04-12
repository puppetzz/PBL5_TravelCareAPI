import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { District } from './district.entity';
import { Address } from './address.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Ward {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @ManyToOne(() => District, (district) => district.wards, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsNotEmpty()
  district: District;

  @OneToMany(() => Address, (address) => address.ward)
  addresses: Address;
}
