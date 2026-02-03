'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { companies } from '@/lib/api';
import { Company } from '@turnos/shared';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, [slug]);

  const fetchCompany = async () => {
    try {
      const response = await companies.getBySlug(slug);
      setCompany(response.data);

      // Apply company branding
      if (response.data.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', response.data.primaryColor);
      }
    } catch (err) {
      console.error('Error loading company:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Empresa no encontrada</h1>
          <p className="text-gray-600">La empresa que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: company.backgroundColor || '#f9fafb' }}
    >
      {/* Header */}
      <header
        className="shadow-sm"
        style={{ backgroundColor: company.primaryColor || '#2563eb' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {company.logo && (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-12 w-auto"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{company.name}</h1>
                {company.description && (
                  <p className="text-white/90 text-sm mt-1">{company.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            {company.address && <p>{company.address}</p>}
            {company.phone && <p>Tel: {company.phone}</p>}
            {company.email && <p>Email: {company.email}</p>}
          </div>
        </div>
      </footer>
    </div>
  );
}
