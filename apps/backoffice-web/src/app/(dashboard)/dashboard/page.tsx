'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Loading, CardSkeleton } from '@/components/ui/Loading';
import { BookingStatusBadge } from '@/components/ui/Badge';
import { Booking, BookingStatus } from '@turnos/shared';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);

  // Get today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get next 7 days range
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const { bookings: todayData, loading: loadingToday } = useBookings({
    companyId: user?.companyId,
    startDate: today.toISOString(),
    endDate: tomorrow.toISOString(),
  });

  const { bookings: upcomingData, loading: loadingUpcoming } = useBookings({
    companyId: user?.companyId,
    startDate: tomorrow.toISOString(),
    endDate: nextWeek.toISOString(),
  });

  useEffect(() => {
    setTodayBookings(todayData);
  }, [todayData]);

  useEffect(() => {
    setUpcomingBookings(upcomingData);
  }, [upcomingData]);

  // Calculate stats
  const stats = {
    today: todayBookings.length,
    pending: todayBookings.filter((b) => b.status === BookingStatus.PENDING).length,
    confirmed: todayBookings.filter((b) => b.status === BookingStatus.CONFIRMED).length,
    upcoming: upcomingBookings.length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.firstName} {user?.lastName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reservas Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.today}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmadas</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximos 7 días</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.upcoming}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Today's Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Reservas de Hoy</h2>
          <Link href="/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todas →
          </Link>
        </div>

        {loadingToday ? (
          <div className="grid gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : todayBookings.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No hay reservas para hoy</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow duration-200">
                <CardBody className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-gray-900">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Cliente: {booking.user?.firstName} {booking.user?.lastName}
                      </p>
                      {booking.notes && (
                        <p className="text-xs text-gray-500 mt-1">{booking.notes}</p>
                      )}
                    </div>
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium ml-4"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/events">
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardBody className="text-center py-8">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Gestionar Eventos</h3>
                <p className="text-sm text-gray-600 mt-1">Crear y editar eventos</p>
              </CardBody>
            </Card>
          </Link>

          <Link href="/bookings">
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardBody className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Ver Reservas</h3>
                <p className="text-sm text-gray-600 mt-1">Calendario de reservas</p>
              </CardBody>
            </Card>
          </Link>

          <Link href="/company">
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardBody className="text-center py-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Configuración</h3>
                <p className="text-sm text-gray-600 mt-1">Personalizar empresa</p>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
