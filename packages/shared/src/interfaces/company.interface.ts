export interface Company {
  id: string;
  slug: string; // URL slug para la página de reservas ej: /empresa-123
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;

  // Personalización
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;

  // Configuración
  timezone: string; // ej: 'America/Argentina/Buenos_Aires'
  defaultQuotaDuration: number; // Duración por defecto en minutos

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateCompanyDto {
  slug: string;
  name: string;
  email: string;
  description?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  defaultQuotaDuration?: number;
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  timezone?: string;
  defaultQuotaDuration?: number;
  isActive?: boolean;
}
