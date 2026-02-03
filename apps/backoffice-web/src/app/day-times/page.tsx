'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AppShell } from '../../components/app-shell';
import { SectionHeader } from '../../components/section-header';
import { api } from '../../lib/api';
import type { DayTime, Event } from '@turnos/shared';
import { DayTimeType, DayOfWeek } from '@turnos/shared';
import { EmptyState } from '../../components/empty-state';

export default function DayTimesPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editDrawer = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dayTimes, setDayTimes] = useState<DayTime[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [formState, setFormState] = useState({
    eventId: '',
    type: DayTimeType.REGULAR,
    dayOfWeek: DayOfWeek.MONDAY,
    specificDate: '',
    startTime: '09:00',
    endTime: '12:00',
    quota: '6',
    disablesRegular: false,
  });
  const [selectedDayTime, setSelectedDayTime] = useState<DayTime | null>(null);
  const [editState, setEditState] = useState({
    id: '',
    eventId: '',
    type: DayTimeType.REGULAR,
    dayOfWeek: DayOfWeek.MONDAY,
    specificDate: '',
    startTime: '09:00',
    endTime: '12:00',
    quota: '6',
    disablesRegular: false,
    isActive: true,
  });

  const loadDayTimes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<DayTime[]>('/day-times');
      setDayTimes(response.data);
    } catch (error) {
      toast({
        title: 'No pudimos cargar horarios',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await api.get<Event[]>('/events');
      setEvents(response.data);
      if (!formState.eventId && response.data[0]?.id) {
        setFormState((prev) => ({ ...prev, eventId: response.data[0].id }));
      }
    } catch (error) {
      toast({
        title: 'No pudimos cargar eventos',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadDayTimes();
    loadEvents();
  }, []);

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const payload = {
        eventId: formState.eventId,
        type: formState.type,
        dayOfWeek: formState.type === DayTimeType.REGULAR ? formState.dayOfWeek : undefined,
        specificDate:
          formState.type === DayTimeType.EXCEPTIONAL && formState.specificDate
            ? formState.specificDate
            : undefined,
        startTime: formState.startTime,
        endTime: formState.endTime,
        quota: Number(formState.quota),
        disablesRegular: formState.disablesRegular,
      };

      await api.post('/day-times', payload);
      toast({
        title: 'Horario creado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setFormState({
        eventId: events[0]?.id || '',
        type: DayTimeType.REGULAR,
        dayOfWeek: DayOfWeek.MONDAY,
        specificDate: '',
        startTime: '09:00',
        endTime: '12:00',
        quota: '6',
        disablesRegular: false,
      });
      await loadDayTimes();
    } catch (error) {
      toast({
        title: 'No pudimos crear el horario',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeBadge = (type: DayTimeType) =>
    type === DayTimeType.REGULAR ? 'blue' : 'purple';

  const openEdit = (dayTime: DayTime) => {
    setSelectedDayTime(dayTime);
    setEditState({
      id: dayTime.id,
      eventId: dayTime.eventId,
      type: dayTime.type,
      dayOfWeek: dayTime.dayOfWeek || DayOfWeek.MONDAY,
      specificDate: dayTime.specificDate
        ? new Date(dayTime.specificDate as any).toISOString().slice(0, 10)
        : '',
      startTime: dayTime.startTime,
      endTime: dayTime.endTime,
      quota: String(dayTime.quota),
      disablesRegular: dayTime.disablesRegular,
      isActive: dayTime.isActive,
    });
    editDrawer.onOpen();
  };

  const handleUpdate = async () => {
    if (!selectedDayTime) return;
    setIsUpdating(true);
    try {
      const payload = {
        eventId: editState.eventId,
        type: editState.type,
        dayOfWeek: editState.type === DayTimeType.REGULAR ? editState.dayOfWeek : undefined,
        specificDate:
          editState.type === DayTimeType.EXCEPTIONAL && editState.specificDate
            ? editState.specificDate
            : undefined,
        startTime: editState.startTime,
        endTime: editState.endTime,
        quota: Number(editState.quota),
        disablesRegular: editState.disablesRegular,
        isActive: editState.isActive,
      };
      await api.put(`/day-times/${selectedDayTime.id}`, payload);
      toast({
        title: 'Horario actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      editDrawer.onClose();
      await loadDayTimes();
    } catch (error) {
      toast({
        title: 'No pudimos actualizar el horario',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AppShell>
      <Stack spacing={6}>
        <SectionHeader
          title="Horarios (Day-Times)"
          subtitle="Configurá horarios regulares y excepcionales con quota."
          actionLabel="Nuevo horario"
          onAction={onOpen}
        />
        <Card>
          <CardBody>
            <Stack spacing={4}>
              {isLoading ? (
                <Text color="text.muted">Cargando horarios...</Text>
              ) : (
                dayTimes.length === 0 ? (
                  <EmptyState
                    title="No hay horarios cargados"
                    description="Creá un horario para habilitar turnos."
                  />
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Tipo</Th>
                        <Th>Día/Fecha</Th>
                        <Th>Horario</Th>
                        <Th>Quota</Th>
                        <Th>Estado</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dayTimes.map((row) => (
                        <Tr key={row.id}>
                          <Td>
                            <Badge colorScheme={getTypeBadge(row.type)}>
                              {row.type}
                            </Badge>
                          </Td>
                          <Td>
                            {row.type === DayTimeType.REGULAR
                              ? row.dayOfWeek
                              : row.specificDate
                                ? new Date(row.specificDate as any).toLocaleDateString()
                                : '-'}
                          </Td>
                          <Td>
                            {row.startTime} - {row.endTime}
                          </Td>
                          <Td>{row.quota}</Td>
                          <Td>
                            <Badge colorScheme={row.isActive ? 'green' : 'gray'}>
                              {row.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </Td>
                          <Td>
                            <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                              Editar
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )
              )}
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo horario</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Evento</FormLabel>
                <Select
                  value={formState.eventId}
                  onChange={(event) =>
                    setFormState({ ...formState, eventId: event.target.value })
                  }
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Tipo</FormLabel>
                <Select
                  value={formState.type}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      type: event.target.value as DayTimeType,
                    })
                  }
                >
                  <option value={DayTimeType.REGULAR}>REGULAR</option>
                  <option value={DayTimeType.EXCEPTIONAL}>EXCEPTIONAL</option>
                </Select>
              </FormControl>
              {formState.type === DayTimeType.REGULAR ? (
                <FormControl>
                  <FormLabel>Día de la semana</FormLabel>
                  <Select
                    value={formState.dayOfWeek}
                    onChange={(event) =>
                      setFormState({
                        ...formState,
                        dayOfWeek: event.target.value as DayOfWeek,
                      })
                    }
                  >
                    {Object.values(DayOfWeek).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <FormControl>
                  <FormLabel>Fecha específica</FormLabel>
                  <Input
                    type="date"
                    value={formState.specificDate}
                    onChange={(event) =>
                      setFormState({
                        ...formState,
                        specificDate: event.target.value,
                      })
                    }
                  />
                </FormControl>
              )}
              <FormControl>
                <FormLabel>Hora inicio</FormLabel>
                <Input
                  type="time"
                  value={formState.startTime}
                  onChange={(event) =>
                    setFormState({ ...formState, startTime: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hora fin</FormLabel>
                <Input
                  type="time"
                  value={formState.endTime}
                  onChange={(event) =>
                    setFormState({ ...formState, endTime: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Quota</FormLabel>
                <Input
                  value={formState.quota}
                  onChange={(event) =>
                    setFormState({ ...formState, quota: event.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} isLoading={isSaving}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer isOpen={editDrawer.isOpen} placement="right" onClose={editDrawer.onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Editar horario</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Evento</FormLabel>
                <Select
                  value={editState.eventId}
                  onChange={(event) =>
                    setEditState({ ...editState, eventId: event.target.value })
                  }
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Tipo</FormLabel>
                <Select
                  value={editState.type}
                  onChange={(event) =>
                    setEditState({
                      ...editState,
                      type: event.target.value as DayTimeType,
                    })
                  }
                >
                  <option value={DayTimeType.REGULAR}>REGULAR</option>
                  <option value={DayTimeType.EXCEPTIONAL}>EXCEPTIONAL</option>
                </Select>
              </FormControl>
              {editState.type === DayTimeType.REGULAR ? (
                <FormControl>
                  <FormLabel>Día de la semana</FormLabel>
                  <Select
                    value={editState.dayOfWeek}
                    onChange={(event) =>
                      setEditState({
                        ...editState,
                        dayOfWeek: event.target.value as DayOfWeek,
                      })
                    }
                  >
                    {Object.values(DayOfWeek).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <FormControl>
                  <FormLabel>Fecha específica</FormLabel>
                  <Input
                    type="date"
                    value={editState.specificDate}
                    onChange={(event) =>
                      setEditState({
                        ...editState,
                        specificDate: event.target.value,
                      })
                    }
                  />
                </FormControl>
              )}
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Hora inicio</FormLabel>
                  <Input
                    type="time"
                    value={editState.startTime}
                    onChange={(event) =>
                      setEditState({ ...editState, startTime: event.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Hora fin</FormLabel>
                  <Input
                    type="time"
                    value={editState.endTime}
                    onChange={(event) =>
                      setEditState({ ...editState, endTime: event.target.value })
                    }
                  />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>Quota</FormLabel>
                <Input
                  value={editState.quota}
                  onChange={(event) =>
                    setEditState({ ...editState, quota: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Select
                  value={editState.isActive ? 'true' : 'false'}
                  onChange={(event) =>
                    setEditState({ ...editState, isActive: event.target.value === 'true' })
                  }
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </Select>
              </FormControl>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="ghost" mr={3} onClick={editDrawer.onClose}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} isLoading={isUpdating}>
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AppShell>
  );
}
