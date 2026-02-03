import { HStack, Text, InputGroup, InputLeftElement, Input, Box, Avatar, IconButton } from '@chakra-ui/react';
import { FiSearch, FiMenu } from 'react-icons/fi';

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <HStack
      justify="space-between"
      align="center"
      px={{ base: 4, lg: 8 }}
      py={4}
      borderBottomWidth="1px"
      borderColor="border.default"
      bg="bg.surface"
      position="sticky"
      top="0"
      zIndex={10}
    >
      <HStack spacing={3}>
        <IconButton
          aria-label="Abrir menu"
          icon={<FiMenu />}
          onClick={onOpenMenu}
          display={{ base: 'inline-flex', lg: 'none' }}
          variant="ghost"
        />
        <Box>
          <Text fontSize="xl" fontWeight="600">
            Panel de Control
          </Text>
          <Text fontSize="sm" color="text.muted">
            Gestión completa de turnos y clientes
          </Text>
        </Box>
      </HStack>
      <HStack spacing={4}>
        <InputGroup w={{ base: '160px', md: '260px' }}>
          <InputLeftElement color="text.muted">
            <FiSearch />
          </InputLeftElement>
          <Input placeholder="Buscar reservas o clientes (próximamente)" isDisabled />
        </InputGroup>
        <HStack spacing={3}>
          <Box textAlign="right">
            <Text fontSize="sm" fontWeight="600">
              Admin
            </Text>
            <Text fontSize="xs" color="text.muted">
              hoy • 09:30
            </Text>
          </Box>
          <Avatar name="Admin" bg="accent.secondary" color="white" />
        </HStack>
      </HStack>
    </HStack>
  );
}
