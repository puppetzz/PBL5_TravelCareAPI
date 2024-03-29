import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  AfterLoad,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Address } from '../../address/entities/address.entity';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from 'src/reviews/entities/review.entity';
import { LocationImage } from './location-image.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { WishList } from 'src/wishlists/wishList.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  rating: number;

  @Column({ nullable: true })
  @ApiProperty()
  about: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isHotel: boolean;

  @Column({ default: 0 })
  reviewCount: number;

  @OneToMany(() => LocationImage, (locationImage) => locationImage.location)
  locationImages: LocationImage[];

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

  @ManyToMany(() => Category, (category) => category.locations, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  categories: Category[];

  @OneToMany(() => Review, (review) => review.location, { onUpdate: 'CASCADE' })
  reviews: Review[];

  @OneToMany(() => WishList, (wishList) => wishList.location)
  wishList: WishList[];

  @OneToOne(() => Hotel, (hotel) => hotel.location)
  hotel: Hotel;

  @AfterLoad()
  calculateAverageRating() {
    if (!this.reviews || this.reviews.length === 0) {
      this.rating = 0;
    } else {
      const sum = this.reviews.reduce(
        (total, review) => total + review.rating,
        0,
      );
      const average = sum / this.reviews.length;
      this.rating = Number(average.toFixed(1));
    }
  }

  imageUrlLocations: string[];
  @AfterLoad()
  imageUrlLocation() {
    const imageUrl = [];

    // Logic for calculating the virtual column
    if (this.locationImages && this.locationImages.length > 0) {
      for (const image of this.locationImages) {
        imageUrl.push(image.imageUrl);
      }
    }

    if (this.reviews) {
      for (const review of this.reviews) {
        if (review.reviewImages) {
          for (const reviewImage of review.reviewImages) {
            imageUrl.push(reviewImage.imageUrl);
          }
        }
      }
    }

    this.imageUrlLocations = imageUrl;
  }
}
