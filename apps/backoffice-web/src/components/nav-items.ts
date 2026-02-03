import { IconType } from 'react-icons';
import { FiCalendar, FiGrid, FiUsers, FiSettings, FiBriefcase } from 'react-icons/fi';

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: FiGrid },
  { label: 'Empresas', href: '/companies', icon: FiBriefcase },
  { label: 'Eventos', href: '/events', icon: FiCalendar },
  { label: 'Horarios', href: '/day-times', icon: FiCalendar },
  { label: 'Reservas', href: '/bookings', icon: FiCalendar },
  { label: 'Usuarios', href: '/users', icon: FiUsers },
  { label: 'Ajustes', href: '/settings', icon: FiSettings },
];
