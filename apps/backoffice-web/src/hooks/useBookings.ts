import { useState, useEffect } from 'react';
import { bookings } from '@/lib/api';
import { Booking, BookingStatus } from '@turnos/shared';

interface BookingsQuery {
  companyId?: string;
  eventId?: string;
  userId?: string;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export function useBookings(query?: BookingsQuery) {
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      fetchBookings(query);
    }
  }, [JSON.stringify(query)]);

  const fetchBookings = async (query: BookingsQuery) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookings.getAll(query);
      setBookingsList(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (data: Partial<Booking>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookings.create(data);
      setBookingsList((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookings.update(id, data);
      setBookingsList((prev) =>
        prev.map((booking) => (booking.id === id ? response.data : booking))
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    return updateBooking(id, { status: BookingStatus.CANCELLED });
  };

  const deleteBooking = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await bookings.delete(id);
      setBookingsList((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings: bookingsList,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
  };
}
