// src/components/ui/SkeletonGrid.jsx
import { SimpleGrid, Skeleton, Box } from '@chakra-ui/react';

export default function SkeletonGrid({ count = 6, minH = '220px' }) {
  const items = Array.from({ length: count });
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
      {items.map((_, i) => (
        <Box key={i}>
          <Skeleton height={minH} borderRadius="lg" />
        </Box>
      ))}
    </SimpleGrid>
  );
}

