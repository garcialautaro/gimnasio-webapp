import { useState, useEffect } from 'react';
import { dayTimes } from '@/lib/api';
import { DayTime } from '@turnos/shared';

export function useDayTimes(eventId?: string) {
  const [dayTimesList, setDayTimesList] = useState<DayTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchDayTimes(eventId);
    }
  }, [eventId]);

  const fetchDayTimes = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dayTimes.getByEvent(eventId);
      setDayTimesList(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  const createDayTime = async (data: Partial<DayTime>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dayTimes.create(data);
      setDayTimesList((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear horario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDayTime = async (id: string, data: Partial<DayTime>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dayTimes.update(id, data);
      setDayTimesList((prev) =>
        prev.map((dt) => (dt.id === id ? response.data : dt))
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar horario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDayTime = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await dayTimes.delete(id);
      setDayTimesList((prev) => prev.filter((dt) => dt.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar horario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    dayTimes: dayTimesList,
    loading,
    error,
    fetchDayTimes,
    createDayTime,
    updateDayTime,
    deleteDayTime,
  };
}
