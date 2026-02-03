'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { events as eventsApi, dayTimes } from '@/lib/api';
import { Event } from '@turnos/shared';
import { formatDateLong, formatTime } from '@/lib/utils';

interface AvailableSlot {
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  quota: number;
  availableQuota: number;
  isExceptional: boolean;
  dayTimeId: string;
}

export default function EventBookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
    fetchAvailableSlots();
  }, [eventId, selectedDate]);

  const fetchEvent = async () => {
    try {
      const response = await eventsApi.getOne(eventId);
      setEvent(response.data);
    } catch (err) {
      console.error('Error loading event:', err);
    }
  };

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 30);

      const response = await dayTimes.getAvailable(
        eventId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setAvailableSlots(response.data);
    } catch (err) {
      console.error('Error loading available slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupSlotsByDate = () => {
    const grouped: Record<string, AvailableSlot[]> = {};
    availableSlots.forEach((slot) => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const handleSelectSlot = (slot: AvailableSlot) => {
    router.push(`/${slug}/events/${eventId}/book?dayTimeId=${slot.dayTimeId}&date=${slot.date}&startTime=${slot.startTime}&endTime=${slot.endTime}`);
  };

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const groupedSlots = groupSlotsByDate();
  const dates = Object.keys(groupedSlots).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push(`/${slug}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a servicios
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: event.color || '#3b82f6' }}
          />
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
        </div>
        {event.description && (
          <p className="text-gray-600">{event.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">Duración: {event.duration} minutos</p>
      </div>

      {/* Available Slots */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      ) : dates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay horarios disponibles
          </h3>
          <p className="text-gray-600">
            Por el momento no hay horarios disponibles para este servicio.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {dates.slice(0, 14).map((date) => {
            const dateObj = new Date(date);
            const slots = groupedSlots[date];

            return (
              <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {formatDateLong(dateObj)}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSlot(slot)}
                      disabled={slot.availableQuota === 0}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        slot.availableQuota === 0
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50 cursor-pointer'
                      }`}
                    >
                      <p className="font-medium text-sm">
                        {formatTime(slot.startTime)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {slot.availableQuota > 0
                          ? `${slot.availableQuota} disponibles`
                          : 'Completo'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
