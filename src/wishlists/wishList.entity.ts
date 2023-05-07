import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userAccountId: string;

  @Column()
  locationId: string;

  @ManyToOne(() => User, (user) => user.wishList)
  user: User;

  @ManyToOne(() => Location, (location) => location.wishList)
  location: Location;
}
