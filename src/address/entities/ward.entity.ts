import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { District } from './district.entity';
import { Address } from './address.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Ward {
  @PrimaryColumn()
  id: string;

  @Column()
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
