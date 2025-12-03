import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  // Personalización
  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column({ length: 7, nullable: true })
  primaryColor: string;

  @Column({ length: 7, nullable: true })
  secondaryColor: string;

  @Column({ length: 7, nullable: true })
  backgroundColor: string;

  // Configuración
  @Column({ length: 100, default: 'America/Argentina/Buenos_Aires' })
  timezone: string;

  @Column({ type: 'int', default: 30 })
  defaultQuotaDuration: number;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  // Relaciones
  @OneToMany(() => Event, (event) => event.company)
  events: Event[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Booking, (booking) => booking.company)
  bookings: Booking[];
}
