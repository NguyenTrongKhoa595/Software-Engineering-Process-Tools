// src/components/ui/EmptyState.jsx
import { Box, Text, Button, VStack } from '@chakra-ui/react';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or check back later.',
  actionLabel,
  onAction,
}) {
  return (
    <VStack spacing={3} py={10} px={4} textAlign="center">
      <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
        {title}
      </Text>
      <Text color="gray.600" maxW="520px">
        {description}
      </Text>
      {actionLabel && (
        <Button mt={2} colorScheme="blue" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </VStack>
  );
}

