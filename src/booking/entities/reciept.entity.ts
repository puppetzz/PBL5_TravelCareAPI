import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToOne(() => Booking, (booking) => booking.receipt, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  booking: Booking;

  @ManyToOne(() => User, (user) => user.receipts)
  user: User;
}
