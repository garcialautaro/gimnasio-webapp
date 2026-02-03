'use client';

import { useState, FormEvent } from 'react';
import { Event } from '@turnos/shared';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EventFormProps {
  event?: Event | null;
  onSubmit: (data: Partial<Event>) => Promise<void>;
  onCancel: () => void;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    description: event?.description || '',
    duration: event?.duration || 30,
    color: event?.color || PRESET_COLORS[0],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.duration < 5) {
      newErrors.duration = 'La duración mínima es 5 minutos';
    }

    if (formData.duration > 480) {
      newErrors.duration = 'La duración máxima es 480 minutos (8 horas)';
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
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del Evento"
        placeholder="Ej: Clase de Yoga, Consulta Médica, etc."
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
        disabled={loading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          placeholder="Describe el evento o servicio..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <Input
        type="number"
        label="Duración (minutos)"
        placeholder="30"
        value={formData.duration}
        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
        error={errors.duration}
        required
        disabled={loading}
        min={5}
        max={480}
        step={5}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              disabled={loading}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                formData.color === color
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="flex items-center">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              disabled={loading}
              className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

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
          {event ? 'Actualizar' : 'Crear'} Evento
        </Button>
      </div>
    </form>
  );
}
