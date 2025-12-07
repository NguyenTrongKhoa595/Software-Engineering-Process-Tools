import Image from 'next/image';
import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import headerImg from '../assets/images/Header.png';

import Property from '../components/Property';

import SearchFilters from '../components/SearchFilters';

// ---------------- Mock Data ----------------
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
    agency: { logo: { url: 'https://plus.unsplash.com/premium_photo-1711697144877-b068f748bcd1?q=80&w=830&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
    isVerified: true,
    categoryExternalID: 'Villa',
    locationExternalIDs: 'Jumeirah Village',
    availabilityExternalIDs: 'now',
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
    agency: { logo: { url: 'https://plus.unsplash.com/premium_photo-1711697144877-b068f748bcd1?q=80&w=830&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
    isVerified: true,
    categoryExternalID: 'Penthouses',
    locationExternalIDs: 'Marina',
    availabilityExternalIDs: 'unavailable',
  },
];

// ---------------- Home Page ----------------
const Home = () => {
  const router = useRouter();
  const { availabilityExternalIDs,
          categoryExternalID,
          locationExternalIDs,
          minPrice,
          maxPrice,
        } = router.query;

  // 🔍 Filter logic
  const filteredProperties = mockProperties.filter((p) => {
    // --- Availability filter ---
    if (availabilityExternalIDs && availabilityExternalIDs !== '') {
      if (p.availabilityExternalIDs !== availabilityExternalIDs) return false;
    }

    // --- Category filter ---
    if (categoryExternalID && categoryExternalID !== '') {
      if (p.categoryExternalID !== categoryExternalID) return false;
    }

    // --- Location filter ---
    if (locationExternalIDs && locationExternalIDs !== '') {
      if (p.locationExternalIDs !== locationExternalIDs) return false;
    }

    // --- Price filter (convert string → number) ---
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    if (min !== null && p.price < min) return false;
    if (max !== null && p.price > max) return false;
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <Box width="100%" height="450px" position="relative">
        <Image
          src={headerImg}
          alt="Header"
          layout="fill"
          style={{ objectFit: 'cover' }}
        />

        <Box
          position="absolute"
          bottom="100px"
          left="50%"
          transform="translateX(-50%)"
          width="80%"
        >
          <SearchFilters />
        </Box>
      </Box>

      {/* Property Grid */}
      <Flex flexWrap="wrap" justifyContent="center" mt="10">
        {filteredProperties.map((property) => (
          <Property property={property} key={property.id} />
        ))}

        {filteredProperties.length === 0 && (
          <Box mt="10" fontSize="24px">No properties found.</Box>
        )}
      </Flex>
    </Box>
  );
};

export default Home;
