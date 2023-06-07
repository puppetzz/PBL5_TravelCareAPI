import { Booking } from 'src/booking/entities/booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Paypal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  transactionId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paidAt: Date;

  @OneToOne(() => Booking, (booking) => booking.paypal)
  booking: Booking;
}
