import { Flex, Heading, Text, Button } from '@chakra-ui/react';

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
      <Flex direction="column" gap={1}>
        <Heading size="md">{title}</Heading>
        {subtitle ? <Text color="text.muted">{subtitle}</Text> : null}
      </Flex>
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </Flex>
  );
}
