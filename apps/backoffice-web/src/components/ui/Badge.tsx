import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { BookingStatus } from '@turnos/shared';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Badge específico para estados de booking
interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const statusConfig = {
    [BookingStatus.PENDING]: { variant: 'warning' as const, label: 'Pendiente' },
    [BookingStatus.CONFIRMED]: { variant: 'success' as const, label: 'Confirmada' },
    [BookingStatus.CANCELLED]: { variant: 'error' as const, label: 'Cancelada' },
    [BookingStatus.COMPLETED]: { variant: 'info' as const, label: 'Completada' },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
