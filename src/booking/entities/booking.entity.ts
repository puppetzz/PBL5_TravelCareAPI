import { Room } from 'src/rooms/entities/rom.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Receipt } from './reciept.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  checkIn: Date;

  @Column({ nullable: false })
  checkOut: Date;

  @Column({ nullable: false, type: 'int' })
  numberOfRooms: number;

  @Column({ nullable: false, default: false })
  isFreeCancel: boolean;

  @Column({ nullable: false })
  freeCancelDueDate: Date;

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0.0,
  })
  cancellationPay: number;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0.0 })
  refund: number;

  @Column({ nullable: false, default: false })
  isPaid: boolean;

  @Column({ nullable: false, default: new Date().toISOString() })
  createAt: Date;

  @Column({ nullable: true })
  updateAt: Date;

  @ManyToMany(() => Room, (room) => room.booking, {
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  rooms: Room[];

  @ManyToOne(() => User, (user) => user.booking)
  user: User;

  @OneToOne(() => Receipt, (receipt) => receipt.booking)
  receipt: Receipt;
}
