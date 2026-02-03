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
import type { Company, CreateUserDto, User } from '@turnos/shared';
import { UserRole } from '@turnos/shared';
import { EmptyState } from '../../components/empty-state';

export default function UsersPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editDrawer = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formState, setFormState] = useState<CreateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: UserRole.COMPANY_STAFF,
    companyId: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editState, setEditState] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: UserRole.COMPANY_STAFF,
    companyId: '',
    isActive: true,
  });

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'No pudimos cargar usuarios',
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
    loadUsers();
    loadCompanies();
  }, []);

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await api.post('/auth/register', formState);
      toast({
        title: 'Usuario creado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setFormState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: UserRole.COMPANY_STAFF,
        companyId: companies[0]?.id || '',
      });
      await loadUsers();
    } catch (error) {
      toast({
        title: 'No pudimos crear el usuario',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setEditState({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      companyId: user.companyId || '',
      isActive: user.isActive,
    });
    editDrawer.onOpen();
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      const payload = {
        firstName: editState.firstName,
        lastName: editState.lastName,
        phone: editState.phone,
        role: editState.role,
        companyId: editState.companyId || undefined,
        isActive: editState.isActive,
      };
      await api.put(`/users/${selectedUser.id}`, payload);
      toast({
        title: 'Usuario actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      editDrawer.onClose();
      await loadUsers();
    } catch (error) {
      toast({
        title: 'No pudimos actualizar el usuario',
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
          title="Usuarios"
          subtitle="Gestioná administradores y staff."
          actionLabel="Invitar usuario"
          onAction={onOpen}
        />
        <Card>
          <CardBody>
            <Stack spacing={4}>
              {isLoading ? (
                <Text color="text.muted">Cargando usuarios...</Text>
              ) : (
                users.length === 0 ? (
                  <EmptyState
                    title="Sin usuarios aún"
                    description="Invitá usuarios para operar el backoffice."
                  />
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Nombre</Th>
                        <Th>Email</Th>
                        <Th>Rol</Th>
                        <Th>Estado</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((row) => (
                        <Tr key={row.id}>
                          <Td>
                            {row.firstName} {row.lastName}
                          </Td>
                          <Td>{row.email}</Td>
                          <Td>
                            <Badge colorScheme="blue">{row.role}</Badge>
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
          <ModalHeader>Nuevo usuario</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={formState.firstName}
                    onChange={(event) =>
                      setFormState({ ...formState, firstName: event.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    value={formState.lastName}
                    onChange={(event) =>
                      setFormState({ ...formState, lastName: event.target.value })
                    }
                  />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  value={formState.email}
                  onChange={(event) =>
                    setFormState({ ...formState, email: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <Input
                  value={formState.phone || ''}
                  onChange={(event) =>
                    setFormState({ ...formState, phone: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rol</FormLabel>
                <Select
                  value={formState.role}
                  onChange={(event) =>
                    setFormState({ ...formState, role: event.target.value as UserRole })
                  }
                >
                  <option value={UserRole.COMPANY_ADMIN}>COMPANY_ADMIN</option>
                  <option value={UserRole.COMPANY_STAFF}>COMPANY_STAFF</option>
                  <option value={UserRole.SUPER_ADMIN}>SUPER_ADMIN</option>
                </Select>
              </FormControl>
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
                <FormLabel>Contraseña inicial</FormLabel>
                <Input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState({ ...formState, password: event.target.value })
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
          <DrawerHeader>Editar usuario</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={editState.firstName}
                    onChange={(event) =>
                      setEditState({ ...editState, firstName: event.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    value={editState.lastName}
                    onChange={(event) =>
                      setEditState({ ...editState, lastName: event.target.value })
                    }
                  />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={editState.email} isDisabled />
              </FormControl>
              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <Input
                  value={editState.phone}
                  onChange={(event) =>
                    setEditState({ ...editState, phone: event.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rol</FormLabel>
                <Select
                  value={editState.role}
                  onChange={(event) =>
                    setEditState({ ...editState, role: event.target.value as UserRole })
                  }
                >
                  <option value={UserRole.COMPANY_ADMIN}>COMPANY_ADMIN</option>
                  <option value={UserRole.COMPANY_STAFF}>COMPANY_STAFF</option>
                  <option value={UserRole.SUPER_ADMIN}>SUPER_ADMIN</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Empresa</FormLabel>
                <Select
                  value={editState.companyId}
                  onChange={(event) =>
                    setEditState({ ...editState, companyId: event.target.value })
                  }
                >
                  <option value="">Sin empresa</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
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
