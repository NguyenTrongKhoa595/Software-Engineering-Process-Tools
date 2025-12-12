import Image from 'next/image';
import { Flex, Box, Text, Button, SlideFade } from '@chakra-ui/react';
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

  // 🔍 Filter logic -----------------------------------------
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

      {/* ================= Hero Section ================= */}
      <Box
        width="100vw"
        height={{ base: "420px", md: "520px" }}
        position="relative"
        left="50%"
        right="50%"
        ml="-50vw"
        mr="-50vw"
        overflow="hidden"
      >
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1555109307-f7d9da25c244?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZW1waXJlJTIwc3RhdGUlMjBidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D"
          alt="Luxury Property Header"
          layout="fill"
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Overlay for readability */}
        <Box
          position="absolute"
          inset="0"
          bg="rgba(0,0,0,0.42)"
        />

        {/* Centered Hero Content */}
        <SlideFade in offsetY={30}>
          <Box
            position="absolute"
            top="42%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            color="white"
            px={6}
          >
            <Text fontSize={{ base: "32px", md: "52px" }} fontWeight="bold">
              Find Your Perfect Home
            </Text>
            <Text fontSize={{ base: "16px", md: "20px" }} opacity={0.9} mt={2}>
              Discover premium properties tailored to your lifestyle
            </Text>
          </Box>
        </SlideFade>

        {/* Search Bar */}
        <Box
          position="absolute"
          bottom="50px"
          left="50%"
          transform="translateX(-50%)"
          width={{ base: "100%", md: "49%" }}
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
