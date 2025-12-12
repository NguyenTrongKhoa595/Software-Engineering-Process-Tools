import Image from 'next/image';
import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SimpleGrid } from '@chakra-ui/react';
import headerImg from '../assets/images/Header.png';

import Property from '../components/Property';

import SearchFilters from '../components/SearchFilters';

import { mockProperties } from '../utils/mockProperties';

// ---------------- Home Page ----------------
const Home = () => {
  const router = useRouter();
  const { availability,
          category,
          location,
          minPrice,
          maxPrice,
        } = router.query;

  // 🔍 Filter logic
  const filteredProperties = mockProperties.filter((p) => {
    // --- Availability filter ---
    if (availability && availability !== '') {
      if (p.availability !== availability) return false;
    }

    // --- Category filter ---
    if (category && category !== '') {
      if (p.category !== category) return false;
    }

    // --- Location filter ---
    if (location && location !== '') {
      if (p.location !== location) return false;
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
      <Box mt="10" px="6">
        {filteredProperties.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="8" justifyItems="center" mt="10">
            {filteredProperties.map((property) => (
              <Property key={property.id} property={property} />
            ))}
          </SimpleGrid>
        ) : (
          <Box mt="10" fontSize="24px" textAlign="center">
            No properties found.
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
