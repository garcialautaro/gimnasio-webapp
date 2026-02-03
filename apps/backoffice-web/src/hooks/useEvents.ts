import { useState, useEffect } from 'react';
import { events } from '@/lib/api';
import { Event } from '@turnos/shared';

export function useEvents(companyId?: string) {
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) {
      fetchEvents(companyId);
    }
  }, [companyId]);

  const fetchEvents = async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await events.getByCompany(companyId);
      setEventsList(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (data: Partial<Event>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await events.create(data);
      setEventsList((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear evento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await events.update(id, data);
      setEventsList((prev) =>
        prev.map((event) => (event.id === id ? response.data : event))
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar evento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await events.delete(id);
      setEventsList((prev) => prev.filter((event) => event.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar evento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    events: eventsList,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
