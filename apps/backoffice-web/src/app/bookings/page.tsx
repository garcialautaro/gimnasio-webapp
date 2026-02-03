'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Card,
  CardBody,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AppShell } from '../../components/app-shell';
import { SectionHeader } from '../../components/section-header';
import { api } from '../../lib/api';
import type { Booking, Event } from '@turnos/shared';
import { BookingStatus } from '@turnos/shared';
import { EmptyState } from '../../components/empty-state';

export default function BookingsPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    eventId: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const loadEvents = async () => {
    try {
      const response = await api.get<Event[]>('/events');
      setEvents(response.data);
    } catch (error) {
      toast({
        title: 'No pudimos cargar eventos',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Booking[]>('/bookings', {
        params: {
          eventId: filters.eventId || undefined,
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        },
      });
      setBookings(response.data);
    } catch (error) {
      toast({
        title: 'No pudimos cargar reservas',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    loadBookings();
  }, []);

  useEffect(() => {
    loadBookings();
  }, [filters]);

  useEffect(() => {
    const date = calendarDate.toISOString().slice(0, 10);
    setFilters((prev) => ({ ...prev, startDate: date, endDate: date }));
  }, [calendarDate]);

  return (
    <AppShell>
      <Stack spacing={6}>
        <SectionHeader
          title="Reservas"
          subtitle="Administrá el estado de las reservas y la asistencia."
          actionLabel="Exportar"
        />
        <Card>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', xl: '320px 1fr' }} gap={6}>
              <GridItem>
                <Stack spacing={4}>
                  <Card variant="outline">
                    <CardBody
                      sx={{
                        '.react-calendar': {
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontFamily: 'var(--font-body)',
                        },
                        '.react-calendar__tile--active': {
                          background: 'var(--chakra-colors-accent-primary)',
                          color: 'white',
                        },
                        '.react-calendar__tile--now': {
                          background: 'var(--chakra-colors-bg-subtle)',
                        },
                      }}
                    >
                      <Calendar
                        onChange={(value) => {
                          if (value instanceof Date) setCalendarDate(value);
                        }}
                        value={calendarDate}
                      />
                    </CardBody>
                  </Card>
                  <FormControl>
                    <FormLabel>Evento</FormLabel>
                    <Select
                      value={filters.eventId}
                      onChange={(event) =>
                        setFilters((prev) => ({ ...prev, eventId: event.target.value }))
                      }
                    >
                      <option value="">Todos</option>
                      {events.map((evt) => (
                        <option key={evt.id} value={evt.id}>
                          {evt.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      value={filters.status}
                      onChange={(event) =>
                        setFilters((prev) => ({ ...prev, status: event.target.value }))
                      }
                    >
                      <option value="">Todos</option>
                      {Object.values(BookingStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack spacing={4}>
                  {isLoading ? (
                    <Text color="text.muted">Cargando reservas...</Text>
                  ) : (
                    bookings.length === 0 ? (
                      <EmptyState
                        title="Sin reservas para este día"
                        description="Probá con otro día o ajustá los filtros."
                      />
                    ) : (
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Cliente</Th>
                            <Th>Fecha</Th>
                            <Th>Horario</Th>
                            <Th>Estado</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {bookings.map((row) => (
                            <Tr key={row.id}>
                              <Td>{row.userId}</Td>
                              <Td>
                                {new Date(row.bookingDate as any).toLocaleDateString()}
                              </Td>
                              <Td>{row.startTime}</Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    row.status === BookingStatus.CONFIRMED
                                      ? 'green'
                                      : row.status === BookingStatus.PENDING
                                        ? 'yellow'
                                        : 'red'
                                  }
                                >
                                  {row.status}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    )
                  )}
                </Stack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </Stack>
    </AppShell>
  );
}
