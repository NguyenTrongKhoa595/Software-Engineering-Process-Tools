import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Image as ChakraImage,
  Button,
  useToast,
  Divider,
  SimpleGrid,
  Grid,
  GridItem,
  Avatar,
  Skeleton,
  SkeletonText,
  Icon,
} from '@chakra-ui/react';
import { FaBed, FaBath, FaRulerCombined, FaCheckCircle } from 'react-icons/fa';
import PageContainer from '@/components/ui/PageContainer';
import Card from '@/components/ui/Card';
import SectionHeader from '@/components/ui/SectionHeader';

// --- Mock Data for UI Development ---
const mockProperty = {
  id: '123',
  title: 'Modern Downtown Loft with Stunning Views',
  address: '123 Main Street, Metropolis, USA 10001',
  rentAmount: 3200,
  status: 'AVAILABLE',
  beds: 2,
  baths: 2,
  sqft: 1250,
  description: 'Experience luxury urban living in this beautifully designed loft. Featuring floor-to-ceiling windows, a gourmet kitchen with stainless steel appliances, and a private balcony overlooking the city skyline. The open-concept living space is perfect for entertaining, while the spacious bedrooms offer a quiet retreat. Located just steps away from the city’s best restaurants, shops, and entertainment venues.',
  photos: [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1613553425973-1f33c4359006?w=800' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800' },
    { id: 'p5', url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800' },
  ],
  amenities: ['Air Conditioning', 'Washer/Dryer', 'Swimming Pool', 'Fitness Center', 'Pet Friendly', '24/7 Security', 'Rooftop Deck', 'Parking Garage'],
  landlord: {
    fullName: 'Jane Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  },
};

// --- Skeleton Component for Loading State ---
const PropertyDetailsSkeleton = () => (
  <PageContainer maxW="1400px">
    <Skeleton h={{ base: '250px', md: '500px' }} borderRadius="xl" mb={8} />
    <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
      <Box flex={3}>
        <Skeleton h="45px" w="80%" mb={4} />
        <Skeleton h="20px" w="60%" mb={6} />
        <SkeletonText mt={6} noOfLines={6} spacing="4" />
      </Box>
      <Box flex={2}>
        <Skeleton h="300px" borderRadius="xl" />
      </Box>
    </Flex>
  </PageContainer>
);

// --- Main Page Component ---
export default function PropertyDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call with mock data
    setTimeout(() => {
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) return <PropertyDetailsSkeleton />;
  if (!property) return <PageContainer><Text>Property not found.</Text></PageContainer>;

  const { title, address, rentAmount, status, beds, baths, sqft, description, photos, amenities, landlord } = property;

  return (
    <PageContainer maxW="1400px">
      {/* --- Image Gallery --- */}
      <Grid
        h={{ base: 'auto', md: '500px' }}
        templateRows={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }}
        templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
        gap={3}
        mb={8}
      >
        <GridItem rowSpan={{ base: 1, md: 2 }} colSpan={2}>
          <ChakraImage src={photos[0].url} alt="Main property view" w="100%" h="100%" objectFit="cover" borderRadius="xl" />
        </GridItem>
        {photos.slice(1, 5).map((photo, i) => (
          <GridItem key={photo.id} display={{ base: i > 1 ? 'none' : 'block', md: 'block' }}>
            <ChakraImage src={photo.url} alt={`Property view ${i + 2}`} w="100%" h="100%" objectFit="cover" borderRadius="lg" />
          </GridItem>
        ))}
      </Grid>

      {/* --- Main Content --- */}
      <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
        {/* Left Column: Details */}
        <Box flex={3}>
          <Heading as="h1" size="xl" letterSpacing="tight">{title}</Heading>
          <Text color="gray.600" mt={2}>{address}</Text>

          <HStack spacing={6} mt={4} color="gray.700">
            <HStack><Icon as={FaBed} mr={2} /> <Text>{beds} Beds</Text></HStack>
            <HStack><Icon as={FaBath} mr={2} /> <Text>{baths} Baths</Text></HStack>
            <HStack><Icon as={FaRulerCombined} mr={2} /> <Text>{sqft} sqft</Text></HStack>
          </HStack>

          <Divider my={8} />

          <Heading as="h2" size="lg" mb={4}>About this home</Heading>
          <Text color="gray.700" whiteSpace="pre-wrap">{description}</Text>

          <Divider my={8} />

          <SectionHeader title="Amenities" subtitle="What this place offers" center={false} />
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} color="gray.700">
            {amenities.map(item => (
              <HStack key={item}><Icon as={FaCheckCircle} color="green.500" /> <Text>{item}</Text></HStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Right Column: Action Card */}
        <Box flex={2} position="relative">
          <Card p={6} position={{ lg: 'sticky' }} top="88px">
            <Text fontSize="2xl" fontWeight="bold">
              ${rentAmount.toLocaleString()} <Text as="span" fontSize="md" color="gray.500">/ month</Text>
            </Text>
            <Badge colorScheme={status === 'AVAILABLE' ? 'green' : 'orange'} mt={2}>{status}</Badge>
            <Button colorScheme="blue" size="lg" w="100%" mt={6}>Request a Tour</Button>
            <Divider my={6} />
            <HStack>
              <Avatar name={landlord.fullName} src={landlord.avatarUrl} />
              <Box>
                <Text fontWeight="bold">{landlord.fullName}</Text>
                <Text fontSize="sm" color="gray.500">Landlord</Text>
              </Box>
            </HStack>
          </Card>
        </Box>
      </Flex>
    </PageContainer>
  );
}
