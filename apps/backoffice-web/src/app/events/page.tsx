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
import type { Company, Event } from '@turnos/shared';
import { EmptyState } from '../../components/empty-state';

export default function EventsPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editDrawer = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formState, setFormState] = useState({
    name: '',
    companyId: '',
    description: '',
    duration: '45',
    color: '#0A6EB4',
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editState, setEditState] = useState({
    id: '',
    name: '',
    companyId: '',
    description: '',
    duration: '45',
    color: '#0A6EB4',
    isActive: true,
  });

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Event[]>('/events');
      setEvents(response.data);
    } catch (error) {
      toast({
        title: 'No pudimos cargar eventos',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await api.get<Company[]>('/companies');
      setCompanies(response.data);
      if (!formState.companyId && response.data[0]?.id) {
        setFormState((prev) => ({ ...prev, companyId: response.data[0].id }));
      }
    } catch (error) {
      toast({
        title: 'No pudimos cargar empresas',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadEvents();
    loadCompanies();
  }, []);

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: formState.name,
        companyId: formState.companyId,
        description: formState.description,
        duration: Number(formState.duration),
        color: formState.color,
      };

      await api.post('/events', payload);
      toast({
        title: 'Evento creado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setFormState({
        name: '',
        companyId: companies[0]?.id || '',
        description: '',
        duration: '45',
        color: '#0A6EB4',
      });
      await loadEvents();
    } catch (error) {
      toast({
        title: 'No pudimos crear el evento',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (event: Event) => {
    setSelectedEvent(event);
    setEditState({
      id: event.id,
      name: event.name,
      companyId: event.companyId,
      description: event.description || '',
      duration: String(event.duration),
      color: event.color || '#0A6EB4',
      isActive: event.isActive,
    });
    editDrawer.onOpen();
  };

  const handleUpdate = async () => {
    if (!selectedEvent) return;
    setIsUpdating(true);
    try {
      const payload = {
        name: editState.name,
        companyId: editState.companyId,
        description: editState.description,
        duration: Number(editState.duration),
        color: editState.color,
        isActive: editState.isActive,
      };
      await api.put(`/events/${selectedEvent.id}`, payload);
      toast({
        title: 'Evento actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      editDrawer.onClose();
      await loadEvents();
    } catch (error) {
      toast({
        title: 'No pudimos actualizar el evento',
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
          title="Eventos"
          subtitle="Creá y configurá los eventos disponibles para cada empresa."
          actionLabel="Nuevo evento"
          onAction={onOpen}
        />
        <Card>
          <CardBody>
            <Stack spacing={4}>
              {isLoading ? (
                <Text color="text.muted">Cargando eventos...</Text>
              ) : (
                events.length === 0 ? (
                  <EmptyState
                    title="No hay eventos"
                    description="Creá un evento para habilitar reservas."
                  />
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Evento</Th>
                        <Th>Duración</Th>
                        <Th>Color</Th>
                        <Th>Estado</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {events.map((row) => (
                        <Tr key={row.id}>
                          <Td>{row.name}</Td>
                          <Td>{row.duration} min</Td>
                          <Td>
                            <Badge bg={row.color || '#0A6EB4'} color="white">
                              {row.color || '#0A6EB4'}
                            </Badge>
                          </Td>
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
          <ModalHeader>Nuevo evento</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Empresa</FormLabel>
                <Select
                  value={formState.companyId}
                  onChange={(event) =>
                    setFormState({ ...formState, companyId: event.target.value })
                  }
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input
                  value={formState.description}
                  onChange={(event) =>
                    setFormState({ ...formState, description: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Duración (min)</FormLabel>
                <Input
                  value={formState.duration}
                  onChange={(event) =>
                    setFormState({ ...formState, duration: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color</FormLabel>
                <Input
                  value={formState.color}
                  onChange={(event) => setFormState({ ...formState, color: event.target.value })}
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
          <DrawerHeader>Editar evento</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Empresa</FormLabel>
                <Select
                  value={editState.companyId}
                  onChange={(event) =>
                    setEditState({ ...editState, companyId: event.target.value })
                  }
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={editState.name}
                  onChange={(event) =>
                    setEditState({ ...editState, name: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input
                  value={editState.description}
                  onChange={(event) =>
                    setEditState({ ...editState, description: event.target.value })
                  }
                />
              </FormControl>
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Duración (min)</FormLabel>
                  <Input
                    value={editState.duration}
                    onChange={(event) =>
                      setEditState({ ...editState, duration: event.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Input
                    value={editState.color}
                    onChange={(event) =>
                      setEditState({ ...editState, color: event.target.value })
                    }
                  />
                </FormControl>
              </HStack>
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
