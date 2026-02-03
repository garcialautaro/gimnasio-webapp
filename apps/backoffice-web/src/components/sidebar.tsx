import Link from 'next/link';
import { Box, Flex, HStack, Text, VStack, Icon, Divider } from '@chakra-ui/react';
import { NAV_ITEMS } from './nav-items';

export function Sidebar() {
  return (
    <Box
      as="aside"
      w={{ base: 'full', lg: '280px' }}
      h="100vh"
      bg="bg.surface"
      borderRightWidth="1px"
      borderColor="border.default"
      position="sticky"
      top="0"
    >
      <Flex direction="column" h="full" px={6} py={6} gap={6}>
        <VStack align="start" spacing={2}>
          <Text fontSize="xs" color="text.muted" letterSpacing="0.2em">
            APUNTAR
          </Text>
          <Text fontSize="2xl" fontFamily="heading">
            Backoffice
          </Text>
        </VStack>
        <Divider />
        <VStack align="stretch" spacing={1}>
          {NAV_ITEMS.map((item) => (
            <HStack
              key={item.href}
              as={Link}
              href={item.href}
              px={3}
              py={2}
              borderRadius="12px"
              _hover={{ bg: 'bg.subtle', color: 'accent.primary' }}
              transition="all 0.2s ease"
            >
              <Icon as={item.icon} />
              <Text fontWeight="500">{item.label}</Text>
            </HStack>
          ))}
        </VStack>
        <Flex mt="auto" align="center" justify="space-between">
          <Box>
            <Text fontSize="sm" fontWeight="600">
              Equipo Apuntar
            </Text>
            <Text fontSize="xs" color="text.muted">
              Administrador
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
