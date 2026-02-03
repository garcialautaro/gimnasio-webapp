import {
  Card,
  CardBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { AppShell } from '../../components/app-shell';
import { SectionHeader } from '../../components/section-header';

export default function SettingsPage() {
  return (
    <AppShell>
      <Stack spacing={6}>
        <SectionHeader
          title="Ajustes"
          subtitle="Configuración general y branding del backoffice."
          actionLabel="Guardar cambios"
        />
        <Card>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Nombre de empresa</FormLabel>
                <Input placeholder="Apuntar Club" />
              </FormControl>
              <FormControl>
                <FormLabel>Slug</FormLabel>
                <Input placeholder="apuntar-club" />
              </FormControl>
              <FormControl>
                <FormLabel>Color primario</FormLabel>
                <Input placeholder="#0A6EB4" />
              </FormControl>
              <FormControl>
                <FormLabel>Color secundario</FormLabel>
                <Input placeholder="#4C6B57" />
              </FormControl>
              <FormControl>
                <FormLabel>Zona horaria</FormLabel>
                <Input placeholder="America/Argentina/Buenos_Aires" />
              </FormControl>
              <FormControl>
                <FormLabel>Duración default</FormLabel>
                <Input placeholder="30" />
              </FormControl>
            </SimpleGrid>
            <Button mt={6}>Actualizar</Button>
          </CardBody>
        </Card>
      </Stack>
    </AppShell>
  );
}
