export interface Event {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  duration: number; // Duración del turno en minutos
  color?: string; // Color para mostrar en el calendario

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateEventDto {
  companyId: string;
  name: string;
  description?: string;
  duration: number;
  color?: string;
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  duration?: number;
  color?: string;
  isActive?: boolean;
}
