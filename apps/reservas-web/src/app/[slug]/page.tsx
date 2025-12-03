'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CompanyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí se haría el fetch a la API para obtener la empresa
    // Por ahora solo mostramos el slug
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Reserva tu Turno</h1>
        <p>Empresa: {slug}</p>
      </header>

      <div>
        <h2>Eventos disponibles</h2>
        <p>Aquí se mostrarían los eventos de la empresa para reservar turnos.</p>

        <div style={{ marginTop: '2rem' }}>
          <h3>Funcionalidades:</h3>
          <ul>
            <li>Ver eventos disponibles de la empresa</li>
            <li>Seleccionar fecha y horario</li>
            <li>Ver disponibilidad en tiempo real</li>
            <li>Confirmar reserva</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
