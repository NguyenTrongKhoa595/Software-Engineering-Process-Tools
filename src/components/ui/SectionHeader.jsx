// src/components/ui/SectionHeader.jsx
import { Box, Heading, Text } from '@chakra-ui/react';

export default function SectionHeader({ title, subtitle, center = true, mb = 8 }) {
  return (
    <Box textAlign={center ? 'center' : 'left'} mb={mb}>
      <Heading
        as="h2"
        size={{ base: 'lg', md: 'xl' }}
        letterSpacing="-0.5px"
      >
        {title}
      </Heading>
      {subtitle && (
        <Text color="gray.600" mt={2} fontSize={{ base: 'sm', md: 'md' }}>
          {subtitle}
        </Text>
      )}
      <Box
        w="70px"
        h="3px"
        bg="brand.500"
        mx={center ? 'auto' : '0'}
        mt={3}
        borderRadius="full"
      />
    </Box>
  );
}

