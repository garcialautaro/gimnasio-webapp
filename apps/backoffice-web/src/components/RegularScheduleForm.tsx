'use client';

import { useState, FormEvent } from 'react';
import { DayTime, DayTimeType, DayOfWeek } from '@turnos/shared';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface RegularScheduleFormProps {
  dayTime?: DayTime | null;
  onSubmit: (data: Partial<DayTime>) => Promise<void>;
  onCancel: () => void;
}

const DAYS_OF_WEEK = [
  { value: DayOfWeek.MONDAY, label: 'Lunes' },
  { value: DayOfWeek.TUESDAY, label: 'Martes' },
  { value: DayOfWeek.WEDNESDAY, label: 'Miércoles' },
  { value: DayOfWeek.THURSDAY, label: 'Jueves' },
  { value: DayOfWeek.FRIDAY, label: 'Viernes' },
  { value: DayOfWeek.SATURDAY, label: 'Sábado' },
  { value: DayOfWeek.SUNDAY, label: 'Domingo' },
];

export default function RegularScheduleForm({ dayTime, onSubmit, onCancel }: RegularScheduleFormProps) {
  const [formData, setFormData] = useState({
    dayOfWeek: dayTime?.dayOfWeek || DayOfWeek.MONDAY,
    startTime: dayTime?.startTime || '09:00',
    endTime: dayTime?.endTime || '10:00',
    quota: dayTime?.quota || 10,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es requerida';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'La hora de fin es requerida';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la hora de inicio';
    }

    if (formData.quota < 1) {
      newErrors.quota = 'El cupo mínimo es 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        type: DayTimeType.REGULAR,
        specificDate: undefined,
        disablesRegular: false,
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Día de la Semana"
        options={DAYS_OF_WEEK}
        value={formData.dayOfWeek}
        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as DayOfWeek })}
        error={errors.dayOfWeek}
        required
        disabled={loading}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="time"
          label="Hora de Inicio"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          error={errors.startTime}
          required
          disabled={loading}
        />

        <Input
          type="time"
          label="Hora de Fin"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          error={errors.endTime}
          required
          disabled={loading}
        />
      </div>

      <Input
        type="number"
        label="Cupos Disponibles"
        placeholder="10"
        value={formData.quota}
        onChange={(e) => setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })}
        error={errors.quota}
        required
        disabled={loading}
        min={1}
        helperText="Número máximo de reservas para este horario"
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="flex-1"
        >
          {dayTime ? 'Actualizar' : 'Crear'} Horario
        </Button>
      </div>
    </form>
  );
}
