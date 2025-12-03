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
import { Company } from './company.entity';
import { DayTime } from './day-time.entity';
import { Booking } from './booking.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  duration: number; // Duración del turno en minutos

  @Column({ length: 7, nullable: true })
  color: string;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  // Relaciones
  @ManyToOne(() => Company, (company) => company.events)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @OneToMany(() => DayTime, (dayTime) => dayTime.event)
  dayTimes: DayTime[];

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
