import { ApiProperty } from '@nestjs/swagger';
import { Location } from 'src/locations/entities/location.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ColumnNumericTransform } from '../utils/column-numeric-tranformer';
import { ReviewImage } from './review-image.entity';
import { TripType } from './trip-type.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0.0,
    nullable: false,
    transformer: new ColumnNumericTransform(),
  })
  @ApiProperty()
  rating: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  reviewAt: Date;

  @Column({ nullable: true })
  updateAt: Date;

  @Column({ nullable: false })
  @ApiProperty()
  tripTime: Date;

  @Column({ nullable: false })
  @ApiProperty()
  title: string;

  @Column({ nullable: false })
  @ApiProperty()
  content: string;

  @ManyToOne(() => User, (user) => user.reviews, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Location, (location) => location.reviews, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  location: Location;

  @OneToMany(() => ReviewImage, (reviewImage) => reviewImage.review, {
    onUpdate: 'CASCADE',
  })
  reviewImages: ReviewImage[];

  @ManyToOne(() => TripType, (tripType) => tripType.reviews, {
    onUpdate: 'CASCADE',
  })
  tripType: TripType;
}
