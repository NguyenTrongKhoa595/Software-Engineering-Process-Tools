import Image from 'next/image';
import { Flex, Box, Text, Button, SlideFade } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Property from '../components/Property';
import SearchFilters from '../components/SearchFilters';
import { mockProperties } from '../utils/mockProperties';
import NavbarTenant from '../components/NavbarTenant';
//import Navbar from '../components/NavbarLLPM';
// ---------------- Home Page ----------------
const Home = () => {
  const router = useRouter();
  const {
    availabilityExternalIDs,
    categoryExternalID,
    locationExternalIDs,
    minPrice,
    maxPrice,
  } = router.query;

  // 🔍 Filter logic -----------------------------------------
  const filteredProperties = mockProperties.filter((p) => {
    if (availabilityExternalIDs && availabilityExternalIDs !== '' && p.availabilityExternalIDs !== availabilityExternalIDs) return false;
    if (categoryExternalID && categoryExternalID !== '' && p.categoryExternalID !== categoryExternalID) return false;
    if (locationExternalIDs && locationExternalIDs !== '' && p.locationExternalIDs !== locationExternalIDs) return false;

    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    if (min !== null && p.price < min) return false;
    if (max !== null && p.price > max) return false;
    return true;
  });

  return (
    <Box>
      <NavbarTenant />

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

      {/* ================= Property List ================= */}
      <Box
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 10 }}
        mt="90px"
      >

        <Box textAlign="center" mb="45px">
          <Text
            fontSize={{ base: "28px", md: "38px" }}
            fontWeight="700"
            letterSpacing="-0.5px"
          >
            Featured Properties
          </Text>
          <Box
            w="70px"
            h="4px"
            bg="teal.400"
            mx="auto"
            mt="10px"
            borderRadius="full"
          />
          <Text color="gray.600" mt="10px" fontSize="17px">
            Hand-picked listings curated for quality & lifestyle
          </Text>
        </Box>

        {/* New Responsive Grid Layout for Cards */}
        <Flex
          wrap="wrap"
          gap="30px"
          justify="center"
          align="stretch"
        >
          {filteredProperties.map((property) => (
            <Property property={property} key={property.id} />
          ))}
        </Flex>

        {/* If No Result */}
        {filteredProperties.length === 0 && (
          <Box mt="10" fontSize="24px" textAlign="center" color="gray.500">
            No properties found.
          </Box>
        )}
      </Box>


      {/* ================= CTA Section ================= */}
      <Box textAlign="center" py="70px" mt="20" bg="gray.50">
        <Text fontSize="32px" fontWeight="bold" mb={3}>
          Ready To Move Into Your Dream House?
        </Text>
        <Text fontSize="18px" color="gray.600" mb={6}>
          Browse thousands of listings updated daily.
        </Text>
        <Button size="lg" colorScheme="teal">
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
 