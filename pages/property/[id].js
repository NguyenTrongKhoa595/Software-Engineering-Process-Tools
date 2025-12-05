import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import Property from '../../components/Property';

const mockProperties = [
  {
    id: '1',
    coverPhoto: { url: 'https://www.hellolanding.com/blog/wp-content/uploads/2020/05/image-3.png' },
    price: 500000,
    rentFrequency: 'yearly',
    rooms: 3,
    title: 'Beautiful Family Home',
    baths: 2,
    area: 1200,
    agency: { logo: { url: 'https://plus.unsplash.com/premium_photo-1711697144877-b068f748bcd1?q=80&w=830&auto=format&fit=crop' } },
    isVerified: true,
    externalID: '1',
  },
  {
    id: '2',
    coverPhoto: { url: 'https://www.hellolanding.com/blog/wp-content/uploads/2020/05/image-3.png' },
    price: 750000,
    rentFrequency: 'yearly',
    rooms: 4,
    title: 'Luxury Villa with Pool',
    baths: 3,
    area: 2000,
    agency: { logo: { url: 'https://plus.unsplash.com/premium_photo-1711697144877-b068f748bcd1?q=80&w=830&auto=format&fit=crop' } },
    isVerified: true,
    externalID: '2',
  },
];

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;

  // find one property
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
