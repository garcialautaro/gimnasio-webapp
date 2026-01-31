'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Alert } from '@/components/ui/Alert';
import { Company } from '@turnos/shared';

const PRESET_COLORS = [
  { name: 'Azul', primary: '#2563eb', secondary: '#3b82f6', bg: '#eff6ff' },
  { name: 'Verde', primary: '#059669', secondary: '#10b981', bg: '#d1fae5' },
  { name: 'Morado', primary: '#7c3aed', secondary: '#8b5cf6', bg: '#f3e8ff' },
  { name: 'Rosa', primary: '#db2777', secondary: '#ec4899', bg: '#fce7f3' },
  { name: 'Naranja', primary: '#ea580c', secondary: '#f97316', bg: '#ffedd5' },
  { name: 'Cyan', primary: '#0891b2', secondary: '#06b6d4', bg: '#cffafe' },
];

export default function CompanyPage() {
  const { user } = useAuth();
  const { company, loading, error, fetchCompany, updateCompany } = useCompany(user?.companyId);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    timezone: 'America/Argentina/Buenos_Aires',
    defaultQuotaDuration: 30,
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        slug: company.slug || '',
        description: company.description || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        logo: company.logo || '',
        primaryColor: company.primaryColor || '#2563eb',
        secondaryColor: company.secondaryColor || '#3b82f6',
        backgroundColor: company.backgroundColor || '#eff6ff',
        timezone: company.timezone || 'America/Argentina/Buenos_Aires',
        defaultQuotaDuration: company.defaultQuotaDuration || 30,
      });
    }
  }, [company]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    }

    if (formData.defaultQuotaDuration < 5) {
      newErrors.defaultQuotaDuration = 'La duración mínima es 5 minutos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate() || !user?.companyId) {
      return;
    }

    setSaving(true);
    try {
      await updateCompany(user.companyId, formData);
      setSuccessMessage('Empresa actualizada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating company:', err);
    } finally {
      setSaving(false);
    }
  };

  const applyPresetColors = (preset: typeof PRESET_COLORS[0]) => {
    setFormData({
      ...formData,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Empresa</h1>
        <p className="text-gray-600 mt-1">Personaliza la información y apariencia de tu empresa</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Nombre de la Empresa"
              placeholder="Mi Empresa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
              disabled={saving}
            />

            <Input
              label="Slug (URL amigable)"
              placeholder="mi-empresa"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              error={errors.slug}
              required
              disabled={saving}
              helperText={`Tu página pública estará en: /reservas/${formData.slug}`}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                placeholder="Describe tu empresa o servicios..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={saving}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Información de Contacto</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="contacto@miempresa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
              disabled={saving}
            />

            <Input
              type="tel"
              label="Teléfono"
              placeholder="+54 11 1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={saving}
            />

            <Input
              label="Dirección"
              placeholder="Calle 123, Ciudad, País"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={saving}
            />
          </CardBody>
        </Card>

        {/* Customization */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Personalización</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="URL del Logo"
              placeholder="https://ejemplo.com/logo.png"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              disabled={saving}
              helperText="URL de la imagen de tu logo"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paleta de Colores Predefinida
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPresetColors(preset)}
                    disabled={saving}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.primaryColor === preset.primary
                        ? 'border-gray-900 scale-105'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${saving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    style={{ backgroundColor: preset.bg }}
                  >
                    <div className="flex gap-1 mb-1">
                      <div className="w-full h-3 rounded" style={{ backgroundColor: preset.primary }} />
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Primario
                </label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  disabled={saving}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Secundario
                </label>
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  disabled={saving}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color de Fondo
                </label>
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  disabled={saving}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Preview */}
            <div
              className="p-6 rounded-lg border-2 border-dashed border-gray-300"
              style={{ backgroundColor: formData.backgroundColor }}
            >
              <p className="text-sm text-gray-600 mb-3">Vista Previa:</p>
              <div className="space-y-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  Botón Primario
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: formData.secondaryColor }}
                >
                  Botón Secundario
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Configuración General</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              type="number"
              label="Duración Predeterminada de Citas (minutos)"
              placeholder="30"
              value={formData.defaultQuotaDuration}
              onChange={(e) => setFormData({ ...formData, defaultQuotaDuration: parseInt(e.target.value) || 0 })}
              error={errors.defaultQuotaDuration}
              required
              disabled={saving}
              min={5}
              step={5}
            />

            <Input
              label="Zona Horaria"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              disabled={saving}
              helperText="Zona horaria para las reservas"
            />
          </CardBody>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="submit" loading={saving} disabled={saving} size="lg">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
