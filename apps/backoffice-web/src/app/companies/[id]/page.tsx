'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { AppShell } from '../../../components/app-shell';
import { SectionHeader } from '../../../components/section-header';
import { api } from '../../../lib/api';
import type { Company } from '@turnos/shared';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const companyId = String(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    email: '',
    description: '',
    phone: '',
    address: '',
    timezone: 'America/Argentina/Buenos_Aires',
    defaultQuotaDuration: '30',
    primaryColor: '#0A6EB4',
    secondaryColor: '#4C6B57',
    backgroundColor: '#F2F4F5',
    logo: '',
  });

  const loadCompany = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Company>(`/companies/${companyId}`);
      setCompany(response.data);
      setFormState({
        name: response.data.name || '',
        slug: response.data.slug || '',
        email: response.data.email || '',
        description: response.data.description || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        timezone: response.data.timezone || 'America/Argentina/Buenos_Aires',
        defaultQuotaDuration: String(response.data.defaultQuotaDuration || 30),
        primaryColor: response.data.primaryColor || '#0A6EB4',
        secondaryColor: response.data.secondaryColor || '#4C6B57',
        backgroundColor: response.data.backgroundColor || '#F2F4F5',
        logo: response.data.logo || '',
      });
    } catch (error) {
      toast({
        title: 'No pudimos cargar la empresa',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: formState.name,
        slug: formState.slug,
        email: formState.email,
        description: formState.description,
        phone: formState.phone,
        address: formState.address,
        timezone: formState.timezone,
        defaultQuotaDuration: Number(formState.defaultQuotaDuration),
        primaryColor: formState.primaryColor,
        secondaryColor: formState.secondaryColor,
        backgroundColor: formState.backgroundColor,
        logo: formState.logo,
      };
      await api.put(`/companies/${companyId}`, payload);
      toast({
        title: 'Empresa actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await loadCompany();
    } catch (error) {
      toast({
        title: 'No pudimos actualizar la empresa',
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
          title="Detalle de empresa"
          subtitle="Actualizá datos generales y branding."
          actionLabel="Volver"
          onAction={() => router.push('/companies')}
        />
        <Card>
          <CardBody>
            {isLoading ? (
              <Text color="text.muted">Cargando...</Text>
            ) : (
              <Stack spacing={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      value={formState.name}
                      onChange={(event) =>
                        setFormState({ ...formState, name: event.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Slug</FormLabel>
                    <Input
                      value={formState.slug}
                      onChange={(event) =>
                        setFormState({ ...formState, slug: event.target.value })
                      }
                    />
                  </FormControl>
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
                      value={formState.phone}
                      onChange={(event) =>
                        setFormState({ ...formState, phone: event.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Dirección</FormLabel>
                    <Input
                      value={formState.address}
                      onChange={(event) =>
                        setFormState({ ...formState, address: event.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Zona horaria</FormLabel>
                    <Input
                      value={formState.timezone}
                      onChange={(event) =>
                        setFormState({ ...formState, timezone: event.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Duración default (min)</FormLabel>
                    <Input
                      value={formState.defaultQuotaDuration}
                      onChange={(event) =>
                        setFormState({
                          ...formState,
                          defaultQuotaDuration: event.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Logo (URL)</FormLabel>
                    <Input
                      value={formState.logo}
                      onChange={(event) =>
                        setFormState({ ...formState, logo: event.target.value })
                      }
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <FormControl>
                    <FormLabel>Color primario</FormLabel>
                    <Input
                      value={formState.primaryColor}
                      onChange={(event) =>
                        setFormState({ ...formState, primaryColor: event.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Color secundario</FormLabel>
                    <Input
                      value={formState.secondaryColor}
                      onChange={(event) =>
                        setFormState({ ...formState, secondaryColor: event.target.value })
                      }
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
                </SimpleGrid>

                <Button alignSelf="flex-start" onClick={handleSave} isLoading={isSaving}>
                  Guardar cambios
                </Button>
              </Stack>
            )}
          </CardBody>
        </Card>
      </Stack>
    </AppShell>
  );
}
