import { DayTimeType, DayOfWeek } from '../enums';

export interface DayTime {
  id: string;
  eventId: string;
  type: DayTimeType;

  // Para REGULAR: día de la semana, para EXCEPTIONAL: null
  dayOfWeek?: DayOfWeek;

  // Para EXCEPTIONAL: fecha específica, para REGULAR: null
  specificDate?: Date;

  // Hora de inicio y fin (formato HH:mm)
  startTime: string; // ej: "09:00"
  endTime: string; // ej: "18:00"

  // Quota disponible
  quota: number;

  // Si es EXCEPTIONAL y desea deshabilitar un day-time regular
  disablesRegular: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateDayTimeDto {
  eventId: string;
  type: DayTimeType;
  dayOfWeek?: DayOfWeek;
  specificDate?: Date | string;
  startTime: string;
  endTime: string;
  quota: number;
  disablesRegular?: boolean;
}

export interface UpdateDayTimeDto {
  startTime?: string;
  endTime?: string;
  quota?: number;
  disablesRegular?: boolean;
  isActive?: boolean;
}

// Para obtener day-times disponibles en un rango
export interface GetAvailableDayTimesQuery {
  eventId: string;
  startDate: Date | string;
  endDate: Date | string;
}

// Respuesta con day-times calculados (regulares + excepcionales)
export interface AvailableDayTimeSlot {
  date: Date | string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  quota: number;
  availableQuota: number; // quota - reservas
  isExceptional: boolean;
  dayTimeId: string;
}
