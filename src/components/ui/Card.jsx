// src/components/ui/Card.jsx
import { Box } from '@chakra-ui/react';
import { forwardRef } from 'react';

const Card = forwardRef(({ children, as = 'div', clickable = false, ...props }, ref) => {
  return (
    <Box
      ref={ref} // Forward the ref to the underlying Chakra Box component
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
});

Card.displayName = 'Card'; // Adding display name for better debugging

export default Card;

