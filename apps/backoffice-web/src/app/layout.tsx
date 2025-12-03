import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Backoffice - Sistema de Gestión de Turnos',
  description: 'Backoffice para gestión de turnos y reservas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <header style={{ padding: '1rem', background: '#333', color: 'white' }}>
          <h1>Backoffice - Gestión de Turnos</h1>
        </header>
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
