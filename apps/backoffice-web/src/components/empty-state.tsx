import { Stack, Text } from '@chakra-ui/react';

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Stack spacing={1} align="center" py={10} color="text.muted">
      <Text fontWeight="600">{title}</Text>
      {description ? <Text fontSize="sm">{description}</Text> : null}
    </Stack>
  );
}
