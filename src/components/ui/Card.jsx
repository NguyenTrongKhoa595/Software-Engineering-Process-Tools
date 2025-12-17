// src/components/ui/Card.jsx
import { Box } from '@chakra-ui/react';

export default function Card({ children, as = 'div', clickable = false, ...props }) {
  return (
    <Box
      as={as}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      rounded="xl"
      shadow="sm"
      transition="all 0.2s ease"
      _hover={clickable ? { shadow: 'md', transform: 'translateY(-2px)' } : undefined}
      {...props}
    >
      {children}
    </Box>
  );
}

