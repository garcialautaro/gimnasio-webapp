import { clsx, ClassValue } from 'clsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Combina clases CSS de manera segura
 */
export function cn(...classes: ClassValue[]) {
  return clsx(classes);
}

/**
 * Formatea una fecha al formato dd/MM/yyyy
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
}

/**
 * Formatea una hora al formato HH:mm
 */
export function formatTime(time: string): string {
  // Si ya viene en formato HH:mm, retornar tal cual
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  // Si viene con segundos, quitar los segundos
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time.substring(0, 5);
  }
  return time;
}

/**
 * Formatea fecha y hora juntos
 */
export function formatDateTime(date: Date | string, time: string): string {
  return `${formatDate(date)} ${formatTime(time)}`;
}

/**
 * Valida un email
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida un teléfono
 */
export function validatePhone(phone: string): boolean {
  return /^[\d\s\-+()]+$/.test(phone);
}

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Trunca un texto a un número máximo de caracteres
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}
