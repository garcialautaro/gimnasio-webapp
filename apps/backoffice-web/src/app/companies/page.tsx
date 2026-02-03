'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import Link from 'next/link';
import { AppShell } from '../../components/app-shell';
import { SectionHeader } from '../../components/section-header';
import { api } from '../../lib/api';
import type { Company } from '@turnos/shared';
import { EmptyState } from '../../components/empty-state';

export default function CompaniesPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    email: '',
    timezone: 'America/Argentina/Buenos_Aires',
    defaultQuotaDuration: '30',
    primaryColor: '#0A6EB4',
    secondaryColor: '#4C6B57',
    backgroundColor: '#F2F4F5',
  });

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Company[]>('/companies');
      setCompanies(response.data);
    } catch (error) {
      toast({
        title: 'No pudimos cargar empresas',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: formState.name,
        slug: formState.slug,
        email: formState.email,
        timezone: formState.timezone,
        defaultQuotaDuration: Number(formState.defaultQuotaDuration),
        primaryColor: formState.primaryColor,
        secondaryColor: formState.secondaryColor,
        backgroundColor: formState.backgroundColor,
      };

      await api.post('/companies', payload);
      toast({
        title: 'Empresa creada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setFormState({
        name: '',
        slug: '',
        email: '',
        timezone: 'America/Argentina/Buenos_Aires',
        defaultQuotaDuration: '30',
        primaryColor: '#0A6EB4',
        secondaryColor: '#4C6B57',
        backgroundColor: '#F2F4F5',
      });
      await loadCompanies();
    } catch (error) {
      toast({
        title: 'No pudimos crear la empresa',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <Stack spacing={6}>
        <SectionHeader
          title="Empresas"
          subtitle="Gestioná el perfil, branding y configuración de cada empresa."
          actionLabel="Nueva empresa"
          onAction={onOpen}
        />
        <Card>
          <CardBody>
            <Stack spacing={4}>
              {isLoading ? (
                <Text color="text.muted">Cargando empresas...</Text>
              ) : (
                companies.length === 0 ? (
                  <EmptyState
                    title="No hay empresas aún"
                    description="Creá la primera empresa para empezar."
                  />
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Empresa</Th>
                        <Th>Slug</Th>
                        <Th>Zona horaria</Th>
                        <Th>Estado</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {companies.map((row) => (
                        <Tr key={row.id}>
                          <Td>{row.name}</Td>
                          <Td>{row.slug}</Td>
                          <Td>{row.timezone}</Td>
                          <Td>
                            <Badge colorScheme={row.isActive ? 'green' : 'gray'}>
                              {row.isActive ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </Td>
                          <Td>
                            <Button
                              as={Link}
                              href={`/companies/${row.id}`}
                              size="sm"
                              variant="outline"
                            >
                              Ver
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
          <ModalHeader>Nueva empresa</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={formState.slug}
                  onChange={(event) => setFormState({ ...formState, slug: event.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  value={formState.email}
                  onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Zona horaria</FormLabel>
                <Input
                  value={formState.timezone}
                  onChange={(event) => setFormState({ ...formState, timezone: event.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Duración default (min)</FormLabel>
                <Input
                  value={formState.defaultQuotaDuration}
                  onChange={(event) =>
                    setFormState({ ...formState, defaultQuotaDuration: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color primario</FormLabel>
                <Input
                  value={formState.primaryColor}
                  onChange={(event) => setFormState({ ...formState, primaryColor: event.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color secundario</FormLabel>
                <Input
                  value={formState.secondaryColor}
                  onChange={(event) => setFormState({ ...formState, secondaryColor: event.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Color de fondo</FormLabel>
                <Input
                  value={formState.backgroundColor}
                  onChange={(event) =>
                    setFormState({ ...formState, backgroundColor: event.target.value })
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
    </AppShell>
  );
}
