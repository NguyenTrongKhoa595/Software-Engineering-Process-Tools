import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FiMapPin } from 'react-icons/fi';
import useRequireAuth from '../../src/hooks/useRequireAuth';
import { useAuth } from '../../src/hooks/useAuth';
import PageContainer from '../../src/components/ui/PageContainer';
import Card from '../../src/components/ui/Card';
import SectionHeader from '../../src/components/ui/SectionHeader';
import SkeletonGrid from '../../src/components/ui/SkeletonGrid';

// --- Mock Data ---
const mockProperties = [
  { id: 1, address: '123 Main Street, New York, NY', imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500' },
  { id: 2, address: '456 Oak Avenue, Los Angeles, CA', imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500' },
  { id: 3, address: '789 Pine Road, Chicago, IL', imageUrl: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500' },
];

// --- Main Page Component ---
export default function PropertySelectionPage() {
  const canRender = useRequireAuth();
  const router = useRouter();
  const { role } = useAuth();
  const { returnTo } = router.query;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelect = (id) => {
    const destination = returnTo || 'property';
    // Simplified logic, assuming returnTo is a path like 'documents'
    router.push(`/${destination}/${id}`);
  };

  if (!canRender) return null;

  return (
    <PageContainer>
      <SectionHeader
        title="Select a Property"
        subtitle="Choose a property to continue."
      />

      {loading ? (
        <SkeletonGrid count={3} />
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {properties.map((prop) => (
            <Card key={prop.id} overflow="hidden" clickable={false}>
              <Image
                src={prop.imageUrl}
                alt={prop.address}
                w="100%"
                h="200px"
                objectFit="cover"
              />
              <VStack p={4} align="stretch" spacing={3}>
                <HStack color="gray.600">
                  <FiMapPin />
                  <Text fontSize="sm" noOfLines={1}>{prop.address}</Text>
                </HStack>
                <Button colorScheme="blue" onClick={() => handleSelect(prop.id)}>
                  Select
                </Button>
              </VStack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </PageContainer>
  );
}
