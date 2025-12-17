// src/components/ui/PageContainer.jsx
import { Box } from '@chakra-ui/react';

export default function PageContainer({ children, maxW = '1200px', py = { base: 6, md: 10 }, px = { base: 4, md: 6 } }) {
  return (
    <Box as="section" maxW={maxW} mx="auto" py={py} px={px}>
      {children}
    </Box>
  );
}

