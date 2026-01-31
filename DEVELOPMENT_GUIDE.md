# Guía de Desarrollo - Sistema de Gestión de Turnos

## 🎯 Estado Actual del Proyecto

### ✅ Completado

#### Backend (100% funcional)
- **TypeORM con MySQL**: Migración completa desde Firebase
- **Entities compartidas** en `packages/shared/src/entities`:
  - Company, User, Event, DayTime, Booking
  - Relaciones entre entidades configuradas
  - Password hashing automático con bcrypt
- **APIs completas**:
  - Backoffice API (puerto 3001)
  - Reservas API (puerto 3002)
- **Servicios implementados**: Companies, Users, Events, DayTimes, Bookings, Auth
- **Autenticación JWT** con validación de password

#### Frontend (Configuración base)
- **Tailwind CSS** configurado en ambos frontends
- **Dependencias instaladas**: date-fns, react-calendar, @heroicons/react
- **API client** configurado en backoffice-web
- **Estructura de directorios** creada

### 📋 Por Implementar (Frontend UI/UX)

## 🚀 Próximos Pasos para Completar la Aplicación

### 1. Backoffice Web (apps/backoffice-web)

#### A. Autenticación y Layout
```typescript
// src/contexts/AuthContext.tsx
// - Context para manejar autenticación
// - Login/logout
// - Persistencia del token

// src/components/Layout.tsx
// - Sidebar con navegación
// - Header con usuario y logout
// - Mobile responsive

// src/app/login/page.tsx
// - Formulario de login
// - Validación
// - Redirect al dashboard
```

#### B. Dashboard
```typescript
// src/app/dashboard/page.tsx
// - Resumen de reservas del día
// - Próximas reservas
// - Estadísticas básicas
// - Links rápidos a secciones
```

#### C. Gestión de Empresa
```typescript
// src/app/company/page.tsx
// - Editar información de empresa
// - Personalización (colores, logo)
// - Preview de cómo se ve la página pública
```

#### D. Gestión de Eventos
```typescript
// src/app/events/page.tsx
// - Lista de eventos
// - Crear/editar/eliminar eventos
// - Modal o formulario inline

// src/components/EventForm.tsx
// - Formulario para crear/editar eventos
// - Campos: nombre, descripción, duración, color
```

#### E. Gestión de Horarios (Day-Times)
```typescript
// src/app/events/[id]/schedules/page.tsx
// - Vista de horarios del evento
// - Tabs: "Horarios Regulares" | "Horarios Excepcionales"

// Horarios Regulares:
// - Tabla por día de semana
// - Agregar/editar/eliminar slots
// - Configurar quota por slot

// Horarios Excepcionales:
// - Calendario para seleccionar fecha
// - Agregar horario especial
// - Opción de deshabilitar horarios regulares
// - Modificar quotas

// src/components/RegularScheduleForm.tsx
// src/components/ExceptionalScheduleForm.tsx
```

#### F. Vista de Reservas
```typescript
// src/app/bookings/page.tsx
// - Calendario mensual con reservas
// - Vista lista con filtros
// - Click en reserva para ver/editar detalles
// - Cambiar estado de reserva

// src/components/BookingCalendar.tsx
// - Usa react-calendar
// - Muestra dots/badges en días con reservas
// - Click abre lista de reservas del día

// src/components/BookingList.tsx
// - Lista filtrable de reservas
// - Filtros: fecha, evento, estado
// - Acciones: ver detalle, cambiar estado, cancelar
```

### 2. Reservas Web (apps/reservas-web)

#### A. Layout Personalizado por Empresa
```typescript
// src/app/[slug]/layout.tsx
// - Fetch de datos de empresa por slug
// - Aplicar colores personalizados
// - Logo de empresa
// - Header con info de empresa
```

#### B. Selección de Evento
```typescript
// src/app/[slug]/page.tsx
// - Lista de eventos disponibles
// - Cards con info del evento
// - Click navega a selección de fecha
```

#### C. Selección de Fecha y Horario
```typescript
// src/app/[slug]/events/[eventId]/page.tsx
// - Calendario para seleccionar fecha
// - Fetch de horarios disponibles del evento
// - Muestra slots disponibles para fecha seleccionada
// - Indica quota disponible
// - Click en slot abre formulario de reserva
```

#### D. Formulario de Reserva
```typescript
// src/app/[slug]/events/[eventId]/book/page.tsx
// - Muestra resumen (fecha, hora, evento)
// - Formulario de datos del cliente:
//   - Nombre, Apellido
//   - Email, Teléfono
//   - Notas opcionales
// - Botón confirmar reserva
// - Loading state
// - Error handling
```

#### E. Confirmación
```typescript
// src/app/[slug]/booking-confirmation/page.tsx
// - Mensaje de éxito
// - Detalles de la reserva
// - Código de confirmación
// - Instrucciones (si aplica)
```

### 3. Componentes UI Compartidos

Crear en `apps/[app]/src/components/ui/`:

```typescript
// Button.tsx
// - Variantes: primary, secondary, danger, ghost
// - Sizes: sm, md, lg
// - Loading state

// Input.tsx
// - Types: text, email, tel, date, time, number
// - Label, error message
// - Icons (opcional)

// Card.tsx
// - Container con shadow y border
// - Header, body, footer slots

// Modal.tsx
// - Backdrop
// - Close button
// - Sizes: sm, md, lg, full
// - Mobile responsive

// Select.tsx
// - Dropdown customizado
// - Placeholder
// - Options

// Calendar.tsx
// - Wrapper sobre react-calendar
// - Estilos customizados
// - Props para días deshabilitados

// Badge.tsx
// - Para estados de reservas
// - Colores por estado

// Alert.tsx
// - Success, error, warning, info
// - Dismissible

// Loading.tsx
// - Spinner
// - Skeleton loaders
```

### 4. Hooks Personalizados

```typescript
// hooks/useAuth.ts
// - Login, logout, register
// - Current user
// - Token management

// hooks/useCompany.ts
// - Fetch company data
// - Update company

// hooks/useEvents.ts
// - CRUD de eventos
// - Lista de eventos por company

// hooks/useDayTimes.ts
// - CRUD de day-times
// - Get available slots

// hooks/useBookings.ts
// - CRUD de reservas
// - Filtros

// hooks/useLocalStorage.ts
// - Persist state en localStorage
```

### 5. Estilos y Responsive

#### Mobile First
- Breakpoints de Tailwind: sm, md, lg, xl, 2xl
- Touch-friendly: botones mínimo 44x44px
- Spacing adecuado para mobile

#### Componentes Responsive
```typescript
// Desktop: Sidebar + Content
// Mobile: Bottom navigation o hamburger menu

// Desktop: Modals grandes
// Mobile: Full screen modals o bottom sheets

// Desktop: Calendarios grandes
// Mobile: Calendarios optimizados para touch
```

## 📊 Estructura de Archivos Recomendada

```
apps/backoffice-web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Layout con sidebar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── company/page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── edit/page.tsx
│   │   │   │   │   └── schedules/page.tsx
│   │   │   └── bookings/page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── EventForm.tsx
│   │   ├── BookingCalendar.tsx
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   └── ...
│   └── lib/
│       └── api.ts

apps/reservas-web/
├── src/
│   ├── app/
│   │   ├── [slug]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── events/
│   │   │   │   └── [eventId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── book/page.tsx
│   │   │   └── booking-confirmation/page.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/...
│   │   ├── EventCard.tsx
│   │   ├── AvailableSlots.tsx
│   │   └── BookingForm.tsx
│   ├── hooks/
│   │   └── usePublicApi.ts
│   └── lib/
│       └── api.ts
```

## 🎨 Diseño UI/UX

### Colores
- Primary: Blue (configurado en Tailwind)
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Gray scale

### Componentes Clave
- **Formularios**: Validación en tiempo real, error messages claros
- **Calendarios**: Destacar días disponibles, deshabilitar días sin slots
- **Loading States**: Skeletons mientras carga data
- **Empty States**: Mensajes cuando no hay datos
- **Error States**: Mensajes de error user-friendly

### Accesibilidad
- Labels en todos los inputs
- ARIA attributes
- Keyboard navigation
- Focus states visibles

## 🔧 Utilidades Recomendadas

```typescript
// lib/utils.ts
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string) {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function formatTime(time: string) {
  return time; // o formatea según necesites
}

// lib/validations.ts
export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string) {
  return /^\+?[\d\s-()]+$/.test(phone);
}
```

## 🚀 Comandos para Desarrollo

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev                    # Todo el monorepo
pnpm dev:backoffice-web     # Solo backoffice
pnpm dev:reservas-web       # Solo reservas
pnpm dev:backoffice-api     # Solo API backoffice
pnpm dev:reservas-api       # Solo API reservas

# Build
pnpm build

# Linting
pnpm lint
```

## 📝 Notas Importantes

1. **Autenticación**: El frontend de backoffice necesita proteger rutas. Usa middleware de Next.js o un HOC.

2. **Variables de Entorno**: Crea `.env.local` en cada app frontend con:
   ```
   NEXT_PUBLIC_BACKOFFICE_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_RESERVAS_API_URL=http://localhost:3002/api
   ```

3. **TypeScript**: Aprovecha los types de `@turnos/shared`

4. **Optimización**:
   - Usa React.memo para componentes pesados
   - Implementa lazy loading para rutas
   - Optimiza imágenes con next/image

5. **Testing**: Considera agregar tests con Jest y React Testing Library

## 🎯 Prioridad de Desarrollo

1. ✅ **Login y Autenticación** (crítico)
2. ✅ **Dashboard básico** (layout + resumen)
3. ✅ **Gestión de Eventos** (CRUD completo)
4. ✅ **Gestión de Horarios** (regular + excepcional)
5. ✅ **Vista de Reservas** (calendario + lista)
6. ✅ **Frontend Público** (flujo completo de reserva)
7. ⚡ **Mejoras UX** (loading states, validaciones, feedback)
8. ⚡ **Mobile Optimization** (responsive, touch-friendly)
9. ⚡ **Features Extra** (notificaciones, exportar, etc.)

Esta guía te permitirá continuar el desarrollo de forma estructurada y completa! 🚀
