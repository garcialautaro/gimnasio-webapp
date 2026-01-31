'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { events } from '@/lib/api';
import { useDayTimes } from '@/hooks/useDayTimes';
import { Event, DayTimeType, DayTime } from '@turnos/shared';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import RegularScheduleForm from '@/components/RegularScheduleForm';
import ExceptionalScheduleForm from '@/components/ExceptionalScheduleForm';

export default function SchedulesPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [activeTab, setActiveTab] = useState<'regular' | 'exceptional'>('regular');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDayTime, setEditingDayTime] = useState<DayTime | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { dayTimes, loading, error, createDayTime, updateDayTime, deleteDayTime } = useDayTimes(eventId);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await events.getOne(eventId);
      setEvent(response.data);
    } catch (err) {
      console.error('Error loading event:', err);
    } finally {
      setLoadingEvent(false);
    }
  };

  const regularDayTimes = dayTimes.filter((dt) => dt.type === DayTimeType.REGULAR);
  const exceptionalDayTimes = dayTimes.filter((dt) => dt.type === DayTimeType.EXCEPTIONAL);

  const handleCreate = () => {
    setEditingDayTime(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dayTime: DayTime) => {
    setEditingDayTime(dayTime);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<DayTime>) => {
    try {
      if (editingDayTime) {
        await updateDayTime(editingDayTime.id, data);
        setSuccessMessage('Horario actualizado correctamente');
      } else {
        await createDayTime({ ...data, eventId });
        setSuccessMessage('Horario creado correctamente');
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving day time:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDayTime(id);
      setSuccessMessage('Horario eliminado correctamente');
      setDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting day time:', err);
    }
  };

  if (loadingEvent) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <Alert variant="error">
        Evento no encontrado
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push('/events')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Eventos
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: event.color || '#3b82f6' }}
              />
              <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            </div>
            <p className="text-gray-600 mt-1">Gestiona los horarios disponibles para este evento</p>
          </div>
          <Button onClick={handleCreate}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Horario
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('regular')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'regular'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Horarios Regulares
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
              {regularDayTimes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('exceptional')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'exceptional'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Horarios Excepcionales
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
              {exceptionalDayTimes.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loading size="lg" />
        </div>
      ) : activeTab === 'regular' ? (
        <RegularSchedulesList
          dayTimes={regularDayTimes}
          onEdit={handleEdit}
          onDelete={setDeleteConfirm}
        />
      ) : (
        <ExceptionalSchedulesList
          dayTimes={exceptionalDayTimes}
          onEdit={handleEdit}
          onDelete={setDeleteConfirm}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDayTime ? 'Editar Horario' : `Crear Horario ${activeTab === 'regular' ? 'Regular' : 'Excepcional'}`}
        size="md"
      >
        {activeTab === 'regular' ? (
          <RegularScheduleForm
            dayTime={editingDayTime}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <ExceptionalScheduleForm
            dayTime={editingDayTime}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Component for Regular Schedules List
function RegularSchedulesList({
  dayTimes,
  onEdit,
  onDelete,
}: {
  dayTimes: DayTime[];
  onEdit: (dt: DayTime) => void;
  onDelete: (id: string) => void;
}) {
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayNames: Record<string, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  if (dayTimes.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-gray-600">No hay horarios regulares configurados</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {daysOfWeek.map((day) => {
        const daySchedules = dayTimes.filter((dt) => dt.dayOfWeek === day);
        if (daySchedules.length === 0) return null;

        return (
          <Card key={day}>
            <CardBody>
              <h3 className="font-semibold text-gray-900 mb-3">{dayNames[day]}</h3>
              <div className="space-y-2">
                {daySchedules.map((dt) => (
                  <div
                    key={dt.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {dt.startTime} - {dt.endTime}
                      </p>
                      <p className="text-sm text-gray-600">Cupos: {dt.quota}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(dt)}>
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(dt.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

// Component for Exceptional Schedules List
function ExceptionalSchedulesList({
  dayTimes,
  onEdit,
  onDelete,
}: {
  dayTimes: DayTime[];
  onEdit: (dt: DayTime) => void;
  onDelete: (id: string) => void;
}) {
  if (dayTimes.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-gray-600">No hay horarios excepcionales configurados</p>
        </CardBody>
      </Card>
    );
  }

  const sortedDayTimes = [...dayTimes].sort((a, b) => {
    const dateA = new Date(a.specificDate!);
    const dateB = new Date(b.specificDate!);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedDayTimes.map((dt) => (
        <Card key={dt.id}>
          <CardBody>
            <div className="mb-3">
              <p className="font-semibold text-gray-900">
                {new Date(dt.specificDate!).toLocaleDateString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {dt.disablesRegular && (
                <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  Deshabilita horarios regulares
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Horario:</span> {dt.startTime} - {dt.endTime}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Cupos:</span> {dt.quota}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => onEdit(dt)} className="flex-1">
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(dt.id)}
                className="text-red-600 hover:bg-red-50"
              >
                Eliminar
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
