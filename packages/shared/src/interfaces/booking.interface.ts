import { BookingStatus } from '../enums';

export interface Booking {
  id: string;
  eventId: string;
  dayTimeId: string;
  userId: string; // Cliente que reserva
  companyId: string;

  // Fecha y hora de la reserva
  bookingDate: Date; // Fecha del turno
  startTime: string; // Hora de inicio
  endTime: string; // Hora de fin

  status: BookingStatus;

  // Notas opcionales
  notes?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingDto {
  eventId: string;
  dayTimeId: string;
  bookingDate: Date | string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  notes?: string;
}

// Para obtener reservas en un rango
export interface GetBookingsQuery {
  companyId?: string;
  eventId?: string;
  userId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: BookingStatus;
}

// Respuesta de reserva con datos poblados
export interface BookingWithDetails extends Booking {
  event?: {
    id: string;
    name: string;
    duration: number;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  company?: {
    id: string;
    name: string;
    slug: string;
  };
}
