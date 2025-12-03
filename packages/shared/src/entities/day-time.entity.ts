import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DayTimeType, DayOfWeek } from '@turnos/shared';
import { Event } from './event.entity';
import { Booking } from './booking.entity';

@Entity('day_times')
export class DayTime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  eventId: string;

  @Column({
    type: 'enum',
    enum: DayTimeType,
  })
  type: DayTimeType;

  // Para REGULAR: día de la semana
  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: true,
  })
  dayOfWeek: DayOfWeek;

  // Para EXCEPTIONAL: fecha específica
  @Column({ type: 'date', nullable: true })
  specificDate: Date;

  // Hora de inicio y fin (formato HH:mm)
  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  // Quota disponible
  @Column({ type: 'int' })
  quota: number;

  // Si es EXCEPTIONAL y desea deshabilitar un day-time regular
  @Column({ default: false })
  disablesRegular: boolean;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  // Relaciones
  @ManyToOne(() => Event, (event) => event.dayTimes)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @OneToMany(() => Booking, (booking) => booking.dayTime)
  bookings: Booking[];
}
