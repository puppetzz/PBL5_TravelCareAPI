import { IsAlphanumeric, IsEmail } from 'class-validator';
import { Location } from 'src/locations/entities/location.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HotelImage } from './hotel-image.entity';
import { PropertyAmenity } from './property-amenity.entity';
import { HotelStyle } from './hotel-style.entity';
import { Language } from './language.entity';
import { Room } from 'src/rooms/entities/rom.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @IsAlphanumeric()
  phoneNumber: string;

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: false, type: 'int', default: 1 })
  hotelClass: number;

  @OneToOne(() => Location, (location) => location.hotel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  location: Location;

  @OneToMany(() => HotelImage, (hotelImage) => hotelImage.hotel, {
    nullable: true,
  })
  hotelImages: HotelImage[];

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];

  @ManyToMany(
    () => PropertyAmenity,
    (propertyAmenity) => propertyAmenity.hotels,
    {
      onUpdate: 'CASCADE',
    },
  )
  @JoinTable()
  propertyAmenities: PropertyAmenity[];

  @ManyToMany(() => HotelStyle, (hotelStyle) => hotelStyle.hotels, {
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  hotelStyles: HotelStyle[];

  @ManyToMany(() => Language, (language) => language.hotels, {
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  languages: Language[];
}
