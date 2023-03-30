import { ApiProperty } from '@nestjs/swagger';
import { Location } from 'src/locations/entities/location.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ReviewImage } from './review-image.entity';
import { TripType } from './trip-type.entity';

@Entity()
export class Review {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0.0 })
  @ApiProperty()
  rating: number;

  @Column({ default: new Date().toISOString() })
  @ApiProperty()
  reviewDate: Date;

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

  @OneToOne(() => TripType, (tripType) => tripType.review, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  tripType: TripType;
}
