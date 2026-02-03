'use client';

import { Box, Drawer, DrawerContent, DrawerOverlay, Flex, useDisclosure } from '@chakra-ui/react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const drawer = useDisclosure();

  return (
    <Flex minH="100vh" bg="bg.canvas">
      <Box display={{ base: 'none', lg: 'block' }}>
        <Sidebar />
      </Box>
      <Flex direction="column" flex="1">
        <Topbar onOpenMenu={drawer.onOpen} />
        <Box px={{ base: 4, lg: 8 }} py={6}>
          {children}
        </Box>
      </Flex>

      <Drawer isOpen={drawer.isOpen} placement="left" onClose={drawer.onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar />
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
