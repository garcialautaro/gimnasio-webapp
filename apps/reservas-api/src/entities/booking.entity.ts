import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BookingStatus } from '@turnos/shared';
import { Event } from './event.entity';
import { DayTime } from './day-time.entity';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @Column({ type: 'uuid' })
  dayTimeId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  companyId: string;

  // Fecha y hora de la reserva
  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  // Notas opcionales
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(() => DayTime, (dayTime) => dayTime.bookings)
  @JoinColumn({ name: 'dayTimeId' })
  dayTime: DayTime;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Company, (company) => company.bookings)
  @JoinColumn({ name: 'companyId' })
  company: Company;
}
