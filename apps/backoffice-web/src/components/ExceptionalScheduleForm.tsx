'use client';

import { useState, FormEvent } from 'react';
import { DayTime, DayTimeType } from '@turnos/shared';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface ExceptionalScheduleFormProps {
  dayTime?: DayTime | null;
  onSubmit: (data: Partial<DayTime>) => Promise<void>;
  onCancel: () => void;
}

export default function ExceptionalScheduleForm({ dayTime, onSubmit, onCancel }: ExceptionalScheduleFormProps) {
  const [formData, setFormData] = useState({
    specificDate: dayTime?.specificDate
      ? new Date(dayTime.specificDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    startTime: dayTime?.startTime || '09:00',
    endTime: dayTime?.endTime || '10:00',
    quota: dayTime?.quota || 10,
    disablesRegular: dayTime?.disablesRegular || false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.specificDate) {
      newErrors.specificDate = 'La fecha es requerida';
    }

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
        type: DayTimeType.EXCEPTIONAL,
        dayOfWeek: undefined,
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="date"
        label="Fecha Específica"
        value={formData.specificDate}
        onChange={(e) => setFormData({ ...formData, specificDate: e.target.value })}
        error={errors.specificDate}
        required
        disabled={loading}
        min={new Date().toISOString().split('T')[0]}
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

      <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <input
          type="checkbox"
          id="disablesRegular"
          checked={formData.disablesRegular}
          onChange={(e) => setFormData({ ...formData, disablesRegular: e.target.checked })}
          disabled={loading}
          className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <div className="flex-1">
          <label htmlFor="disablesRegular" className="block text-sm font-medium text-gray-900 cursor-pointer">
            Deshabilitar horarios regulares para esta fecha
          </label>
          <p className="text-xs text-gray-600 mt-1">
            Si está marcado, los horarios regulares no estarán disponibles en esta fecha específica
          </p>
        </div>
      </div>

      {formData.disablesRegular && (
        <Alert variant="warning">
          <p className="text-sm">
            <strong>Atención:</strong> Los horarios regulares para este día serán deshabilitados y solo estará disponible este horario excepcional.
          </p>
        </Alert>
      )}

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
