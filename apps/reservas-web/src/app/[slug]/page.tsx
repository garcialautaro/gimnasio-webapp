'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { companies, events as eventsApi } from '@/lib/api';
import { Company, Event } from '@turnos/shared';
import Link from 'next/link';

export default function CompanyEventsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const companyResponse = await companies.getBySlug(slug);
      setCompany(companyResponse.data);

      const eventsResponse = await eventsApi.getByCompany(companyResponse.data.id);
      setEvents(eventsResponse.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!company || events.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No hay servicios disponibles
        </h2>
        <p className="text-gray-600">
          Por el momento no hay servicios disponibles para reservar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona un Servicio
        </h2>
        <p className="text-gray-600">
          Elige el servicio que deseas reservar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/${slug}/events/${event.id}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div
              className="h-3"
              style={{ backgroundColor: event.color || '#3b82f6' }}
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.name}
              </h3>
              {event.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Duración: {event.duration} minutos
              </div>
              <div className="mt-4">
                <span
                  className="inline-block px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: event.color || '#3b82f6' }}
                >
                  Reservar →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
