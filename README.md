# Sistema de Gestión de Turnos - Monorepo

Sistema completo de gestión de turnos y reservas con arquitectura de monorepo, utilizando Next.js para los frontends y NestJS con TypeORM para los backends, con MySQL como base de datos.

## 🏗️ Arquitectura del Proyecto

Este monorepo contiene:

### Apps

- **backoffice-web** (Next.js): Frontend para administración y gestión del backoffice
- **reservas-web** (Next.js): Frontend público para reserva de turnos
- **backoffice-api** (NestJS): BFF (Backend For Frontend) para el backoffice
- **reservas-api** (NestJS): BFF para el frontend de reservas

### Packages

- **shared**: Tipos, interfaces y enums compartidos entre todas las apps

## 🚀 Características Principales

### Gestión de Horarios (Day-Times)

- **Day-times regulares**: Horarios recurrentes por día de la semana
- **Day-times excepcionales**: Horarios especiales para fechas específicas
  - Pueden deshabilitar horarios regulares
  - Pueden habilitar horarios no regulares
  - Pueden modificar quotas de horarios regulares

### Empresas Multi-tenant

- Cada empresa tiene su propio slug (ej: `/mi-empresa`)
- Personalización de colores y branding
- Gestión independiente de eventos y horarios

### Usuarios

- **Super Admin**: Administrador del sistema
- **Company Admin**: Administrador de empresa
- **Company Staff**: Personal de la empresa
- **Client**: Clientes que reservan turnos

### Eventos y Reservas

- Múltiples eventos por empresa
- Quotas configurables por evento y horario
- Sistema de reservas con estados (pending, confirmed, cancelled, completed, no_show)
- Calendario integrado para visualización

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MySQL >= 8.0

## 🛠️ Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd gimnasio-webapp
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

Copiar `.env.example` a `.env` y completar con tus credenciales de MySQL:

```bash
cp .env.example .env
```

Variables requeridas:
- `DB_HOST` - Host de MySQL (ej: localhost)
- `DB_PORT` - Puerto de MySQL (ej: 3306)
- `DB_USERNAME` - Usuario de MySQL
- `DB_PASSWORD` - Contraseña de MySQL
- `DB_DATABASE` - Nombre de la base de datos (ej: turnos)
- `JWT_SECRET` - Clave secreta para JWT
- `NODE_ENV` - Entorno (development/production)

## 🏃 Desarrollo

### Ejecutar todo el monorepo en desarrollo:

```bash
pnpm dev
```

### Ejecutar aplicaciones individuales:

```bash
# Backoffice Web (puerto 3000)
pnpm dev:backoffice-web

# Reservas Web (puerto 3003)
pnpm dev:reservas-web

# Backoffice API (puerto 3001)
pnpm dev:backoffice-api

# Reservas API (puerto 3002)
pnpm dev:reservas-api
```

## 🏗️ Build

### Build de todas las aplicaciones:

```bash
pnpm build
```

### Build individual:

```bash
pnpm build:backoffice-web
pnpm build:reservas-web
pnpm build:backoffice-api
pnpm build:reservas-api
```

## 🚢 Producción

```bash
# Iniciar aplicaciones en producción
pnpm start:backoffice-web
pnpm start:reservas-web
pnpm start:backoffice-api
pnpm start:reservas-api
```

## 📁 Estructura del Proyecto

```
gimnasio-webapp/
├── apps/
│   ├── backoffice-web/       # Frontend Backoffice (Next.js)
│   │   ├── src/
│   │   │   └── app/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── tsconfig.json
│   │
│   ├── reservas-web/         # Frontend Reservas (Next.js)
│   │   ├── src/
│   │   │   └── app/
│   │   │       └── [slug]/   # Rutas dinámicas por empresa
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── tsconfig.json
│   │
│   ├── backoffice-api/       # BFF Backoffice (NestJS)
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── companies/
│   │   │   ├── events/
│   │   │   ├── day-times/
│   │   │   ├── bookings/
│   │   │   ├── users/
│   │   │   └── common/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── reservas-api/         # BFF Reservas (NestJS)
│       ├── src/
│       │   ├── auth/
│       │   ├── companies/
│       │   ├── events/
│       │   ├── day-times/
│       │   └── bookings/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/               # Tipos e interfaces compartidos
│   │   ├── src/
│   │   │   ├── enums/
│   │   │   ├── interfaces/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── firebase-config/      # Configuración de Firebase
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── package.json              # Workspace root
├── pnpm-workspace.yaml       # Configuración de workspaces
├── tsconfig.base.json        # Configuración base de TypeScript
├── .env.example              # Ejemplo de variables de entorno
└── README.md
```

## 🔐 Autenticación

El sistema utiliza Firebase Authentication para la gestión de usuarios y JWT para la autenticación en las APIs.

### Endpoints principales:

**Backoffice API:**
- POST `/api/auth/register` - Registrar usuario (admin/staff)
- POST `/api/auth/login` - Login

**Reservas API:**
- POST `/api/auth/register` - Registrar cliente

## 📡 API Endpoints

### Backoffice API (Puerto 3001)

#### Companies
- GET `/api/companies` - Listar empresas
- POST `/api/companies` - Crear empresa
- GET `/api/companies/:id` - Obtener empresa
- GET `/api/companies/slug/:slug` - Obtener empresa por slug
- PUT `/api/companies/:id` - Actualizar empresa
- DELETE `/api/companies/:id` - Eliminar empresa

#### Events
- GET `/api/events` - Listar eventos
- GET `/api/events?companyId=:id` - Eventos por empresa
- POST `/api/events` - Crear evento
- GET `/api/events/:id` - Obtener evento
- PUT `/api/events/:id` - Actualizar evento
- DELETE `/api/events/:id` - Eliminar evento

#### Day-Times
- GET `/api/day-times` - Listar day-times
- GET `/api/day-times?eventId=:id` - Day-times por evento
- GET `/api/day-times/available?eventId=:id&startDate=:date&endDate=:date` - Day-times disponibles
- POST `/api/day-times` - Crear day-time
- PUT `/api/day-times/:id` - Actualizar day-time
- DELETE `/api/day-times/:id` - Eliminar day-time

#### Bookings
- GET `/api/bookings` - Listar reservas (con filtros)
- POST `/api/bookings` - Crear reserva
- GET `/api/bookings/:id` - Obtener reserva
- PUT `/api/bookings/:id` - Actualizar reserva
- DELETE `/api/bookings/:id` - Eliminar reserva

### Reservas API (Puerto 3002)

#### Companies
- GET `/api/companies/slug/:slug` - Obtener empresa por slug
- GET `/api/companies/:id` - Obtener empresa

#### Events
- GET `/api/events?companyId=:id` - Eventos por empresa

#### Day-Times
- GET `/api/day-times/available?eventId=:id&startDate=:date&endDate=:date` - Horarios disponibles

#### Bookings
- POST `/api/bookings` - Crear reserva

## 🎨 Personalización por Empresa

Cada empresa puede personalizar:
- Logo
- Color primario
- Color secundario
- Color de fondo
- Zona horaria
- Duración por defecto de quota

## 📊 Modelos de Datos

### Company
```typescript
{
  id: string;
  slug: string;
  name: string;
  email: string;
  description?: string;
  phone?: string;
  address?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  timezone: string;
  defaultQuotaDuration: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### Event
```typescript
{
  id: string;
  companyId: string;
  name: string;
  description?: string;
  duration: number; // minutos
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### DayTime
```typescript
{
  id: string;
  eventId: string;
  type: 'REGULAR' | 'EXCEPTIONAL';
  dayOfWeek?: 'MONDAY' | 'TUESDAY' | ... ; // para REGULAR
  specificDate?: Date; // para EXCEPTIONAL
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  quota: number;
  disablesRegular: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### Booking
```typescript
{
  id: string;
  eventId: string;
  dayTimeId: string;
  userId: string;
  companyId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Comandos Útiles

```bash
# Limpiar todas las builds
pnpm clean

# Lint
pnpm lint

# Build de packages compartidos
cd packages/shared && pnpm build
cd packages/firebase-config && pnpm build
```

## 📝 Notas de Desarrollo

### Day-Times Regulares vs Excepcionales

- **Regulares**: Se repiten semanalmente en el día especificado
- **Excepcionales**: Para fechas específicas
  - Si `disablesRegular = true`: Oculta los horarios regulares para esa fecha
  - Si `disablesRegular = false`: Se suma a los horarios disponibles

### Cálculo de Disponibilidad

El servicio `DayTimesService.getAvailableDayTimes()` calcula automáticamente:
1. Los horarios regulares para cada día del rango
2. Aplica los excepcionales que correspondan
3. Resta las reservas existentes de la quota
4. Retorna los slots disponibles con su quota restante

## 🤝 Contribuir

Este es un proyecto base. Para extenderlo:

1. Agregar más campos a los modelos según necesidades
2. Implementar UI completa en los frontends
3. Agregar validaciones de negocio
4. Implementar notificaciones
5. Agregar integración con pagos
6. Implementar recordatorios por email/SMS

## 📄 Licencia

MIT
