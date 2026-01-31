import { useState, useEffect } from 'react';
import { companies } from '@/lib/api';
import { Company } from '@turnos/shared';

export function useCompany(companyId?: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId);
    }
  }, [companyId]);

  const fetchCompany = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await companies.getOne(id);
      setCompany(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar empresa');
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (id: string, data: Partial<Company>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await companies.update(id, data);
      setCompany(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar empresa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    company,
    loading,
    error,
    fetchCompany,
    updateCompany,
  };
}
