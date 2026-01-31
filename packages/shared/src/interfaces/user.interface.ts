import { UserRole } from '../enums';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;

  // Si es COMPANY_ADMIN o COMPANY_STAFF
  companyId?: string;


  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  companyId?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
}

export interface AuthUserDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
