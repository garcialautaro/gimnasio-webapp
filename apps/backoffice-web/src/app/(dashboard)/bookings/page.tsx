'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading, CardSkeleton } from '@/components/ui/Loading';
import { BookingStatusBadge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Booking, BookingStatus } from '@turnos/shared';
import { formatDate, formatTime } from '@/lib/utils';

export default function BookingsPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Get date range for current month
  const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

  const { bookings, loading, error, updateBooking } = useBookings({
    companyId: user?.companyId,
    startDate: startOfMonth.toISOString(),
    endDate: endOfMonth.toISOString(),
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
  });

  const handleChangeStatus = async (booking: Booking, newStatus: BookingStatus) => {
    try {
      await updateBooking(booking.id, { status: newStatus });
      setSuccessMessage('Estado de reserva actualizado correctamente');
      setSelectedBooking(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  // Filter bookings by selected date
  const filteredBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.bookingDate);
    return (
      bookingDate.getFullYear() === selectedDate.getFullYear() &&
      bookingDate.getMonth() === selectedDate.getMonth()
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-1">Gestiona las reservas de tu empresa</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('list')}
            size="sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Lista
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('calendar')}
            size="sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendario
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" dismissible onDismiss={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardBody className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Month Selector */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={prevMonth}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <div className="flex-1 text-center font-medium">
                {selectedDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
              </div>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>

            {/* Status Filter */}
            <Select
              label="Filtrar por Estado"
              options={[
                { value: 'ALL', label: 'Todos los estados' },
                { value: BookingStatus.PENDING, label: 'Pendientes' },
                { value: BookingStatus.CONFIRMED, label: 'Confirmadas' },
                { value: BookingStatus.CANCELLED, label: 'Canceladas' },
                { value: BookingStatus.COMPLETED, label: 'Completadas' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'ALL')}
            />

            {/* Stats */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{filteredBookings.length}</p>
                <p className="text-sm text-gray-600">Reservas este mes</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reservas</h3>
            <p className="text-gray-600">No se encontraron reservas con los filtros seleccionados</p>
          </CardBody>
        </Card>
      ) : viewMode === 'list' ? (
        <BookingsListView bookings={filteredBookings} onSelectBooking={setSelectedBooking} />
      ) : (
        <BookingsCalendarView bookings={filteredBookings} selectedDate={selectedDate} onSelectBooking={setSelectedBooking} />
      )}

      {/* Booking Detail Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Detalle de Reserva"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Información de la Reserva</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Fecha:</dt>
                  <dd className="font-medium">{formatDate(selectedBooking.bookingDate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Horario:</dt>
                  <dd className="font-medium">
                    {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Estado:</dt>
                  <dd>
                    <BookingStatusBadge status={selectedBooking.status} />
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Nombre:</dt>
                  <dd className="font-medium">
                    {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Email:</dt>
                  <dd className="font-medium">{selectedBooking.user?.email}</dd>
                </div>
                {selectedBooking.user?.phone && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Teléfono:</dt>
                    <dd className="font-medium">{selectedBooking.user.phone}</dd>
                  </div>
                )}
              </dl>
            </div>

            {selectedBooking.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notas</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <h3 className="font-semibold text-gray-900 mb-2">Acciones</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedBooking.status !== BookingStatus.CONFIRMED && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleChangeStatus(selectedBooking, BookingStatus.CONFIRMED)}
                    className="w-full"
                  >
                    Confirmar
                  </Button>
                )}
                {selectedBooking.status !== BookingStatus.COMPLETED && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleChangeStatus(selectedBooking, BookingStatus.COMPLETED)}
                    className="w-full"
                  >
                    Completar
                  </Button>
                )}
                {selectedBooking.status !== BookingStatus.CANCELLED && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleChangeStatus(selectedBooking, BookingStatus.CANCELLED)}
                    className="w-full col-span-2"
                  >
                    Cancelar Reserva
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// List View Component
function BookingsListView({ bookings, onSelectBooking }: { bookings: Booking[]; onSelectBooking: (booking: Booking) => void }) {
  // Sort by date and time
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateCompare = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="space-y-3">
      {sortedBookings.map((booking) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => onSelectBooking(booking)}>
          <CardBody className="py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-gray-900">{formatDate(booking.bookingDate)}</p>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                  {' • '}
                  {booking.user?.firstName} {booking.user?.lastName}
                </p>
                {booking.notes && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{booking.notes}</p>
                )}
              </div>
              <Button variant="ghost" size="sm">
                Ver detalles →
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

// Calendar View Component
function BookingsCalendarView({
  bookings,
  selectedDate,
  onSelectBooking,
}: {
  bookings: Booking[];
  selectedDate: Date;
  onSelectBooking: (booking: Booking) => void;
}) {
  // Group bookings by date
  const bookingsByDate: Record<string, Booking[]> = {};
  bookings.forEach((booking) => {
    const dateKey = new Date(booking.bookingDate).toISOString().split('T')[0];
    if (!bookingsByDate[dateKey]) {
      bookingsByDate[dateKey] = [];
    }
    bookingsByDate[dateKey].push(booking);
  });

  // Generate calendar days
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendarDays: (Date | null)[] = [];

  // Add empty days for alignment
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  }

  return (
    <Card>
      <CardBody className="p-4">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = date.toISOString().split('T')[0];
            const dayBookings = bookingsByDate[dateKey] || [];
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={dateKey}
                className={`aspect-square border rounded-lg p-2 ${
                  isToday ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'
                } hover:shadow-md transition-shadow duration-200 cursor-pointer`}
              >
                <div className="text-sm font-medium text-gray-900 mb-1">{date.getDate()}</div>
                {dayBookings.length > 0 && (
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => onSelectBooking(booking)}
                        className="text-xs p-1 bg-primary-100 text-primary-800 rounded truncate hover:bg-primary-200"
                      >
                        {formatTime(booking.startTime)}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-gray-600 pl-1">+{dayBookings.length - 2} más</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
