# Plan de Trabajo - Sistema de Turnos

## Objetivo
Completar el sistema con MySQL (TypeORM) y construir el frontend en Chakra UI con theme global.

## Estado Actual
- En curso: Ajustes finales según feedback
- Siguiente: Cierre de entrega

## Módulo 0 - Setup y Base de Datos (actual)
- [x] Definir variables de entorno para MySQL y JWT
- [x] Migrar backends a TypeORM (ambas APIs)
- [x] Validar entidades y relaciones
- [x] Integrar Firebase Auth con token y firebaseUid en MySQL

## Módulo 1 - Backoffice API (MySQL)
- [x] Auth: registro/login con Firebase Auth (MySQL solo perfil + firebaseUid)
- [x] Users: CRUD y búsquedas por empresa
- [x] Events: CRUD por empresa
- [x] Day-Times: CRUD + disponibilidad
- [x] Bookings: CRUD + quota

## Módulo 2 - Reservas API (MySQL)
- [x] Auth: registro cliente con Firebase Auth (MySQL solo perfil + firebaseUid)
- [x] Companies: lectura pública
- [x] Events: lectura por empresa
- [x] Day-Times: disponibilidad
- [x] Bookings: creación

## Módulo 3 - Theme global Chakra UI
- [x] Definir paleta (azul francia, verde musgo, blanco, gris humo)
- [x] Tokens, componentes base y estilos

## Módulo 4 - Backoffice Web
- [x] Layout base + navegación
- [x] Auth (login Firebase + token)
- [x] Configurar env Firebase en frontend
- [x] Dashboard (UI base)
- [x] Companies (listado + alta)
- [x] Companies (detalle y branding)
- [x] Events (listado + alta)
- [x] Events (edición)
- [x] Day-Times (listado + alta)
- [x] Day-Times (edición)
- [x] Bookings (listado + filtros)
- [x] Bookings (calendario)
- [x] Users (listado + alta)
- [x] Users (edición)
- [x] Cierre Backoffice Web (QA + ajustes UI)

## Módulo 5 - Reservas Web
- [x] Landing por empresa (slug)
- [x] Listado de eventos
- [x] Selección de día y horario
- [x] Confirmación de reserva

## QA Final
- [x] Verificar envs (.env) y variables Firebase
- [x] Revisar flujos: login backoffice + login cliente
- [x] Revisar errores de API (401/400) y mensajes en UI
- [x] Ajustes visuales finales

## Ajustes finales
- [x] Copy de placeholders/estados deshabilitados
- [x] Ajustes menores de background
