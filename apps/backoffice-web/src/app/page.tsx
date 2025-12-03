export default function HomePage() {
  return (
    <div>
      <h2>Bienvenido al Backoffice</h2>
      <p>Sistema de gestión de turnos y reservas</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Funcionalidades disponibles:</h3>
        <ul>
          <li>Gestión de empresas</li>
          <li>Gestión de eventos</li>
          <li>Configuración de horarios (day-times regulares y excepcionales)</li>
          <li>Gestión de quotas</li>
          <li>Visualización de reservas en calendario</li>
          <li>Gestión de usuarios</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Próximos pasos:</h3>
        <ol>
          <li>Configurar las variables de entorno</li>
          <li>Inicializar Firebase</li>
          <li>Crear una empresa</li>
          <li>Configurar eventos y horarios</li>
        </ol>
      </div>
    </div>
  )
}
