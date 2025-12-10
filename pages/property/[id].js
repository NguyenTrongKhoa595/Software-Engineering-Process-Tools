import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import Property from '../../components/Property';
import { mockProperties } from '../../utils/mockProperties'; // import shared mock

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;

  // find the property by id
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return <Text p="4">Property not found.</Text>;
  }

  return (
    <Box p="4">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        Property Details
      </Text>
      <Property property={property} />
    </Box>
  );
}
  