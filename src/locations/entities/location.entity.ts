import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Address } from '../../address/entities/address.entity';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from 'src/reviews/entities/review.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0.0 })
  @ApiProperty()
  rating: number;

  @Column({ nullable: true })
  @ApiProperty()
  About: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isHotel: boolean;

  @ManyToOne(() => User, (user) => user.locations, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToOne(() => Address, (address) => address.location, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  address: Address;

  @ManyToMany(() => Category, (category) => category, { onUpdate: 'CASCADE' })
  categories: Category[];

  @OneToMany(() => Review, (review) => review.location, { onUpdate: 'CASCADE' })
  reviews: Review[];
}
