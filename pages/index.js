import { Flex, Box, Text, Button, SlideFade, SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Property from '@/components/Property';
import SearchFilters from '@/components/SearchFilters';
import { mockProperties } from '@/utils/mockProperties';
import { useAuth } from '@/hooks/useAuth';
import PageContainer from '@/components/ui/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import SkeletonGrid from '@/components/ui/SkeletonGrid';
// ---------------- Home Page ----------------
const Home = () => {
  const router = useRouter();
  const { role: userRole } = useAuth();
  const { query } = router;

  const [properties, setProperties] = useState(null); // Start with null for loading state

  // Simulate fetching and filtering properties
  useEffect(() => {
    setProperties(null); // Trigger skeleton on query change
    const timer = setTimeout(() => {
      const filtered = mockProperties.filter((p) => {
        if (query.availabilityExternalIDs && p.availabilityExternalIDs !== query.availabilityExternalIDs) return false;
        if (query.categoryExternalID && p.categoryExternalID !== query.categoryExternalID) return false;
        if (query.locationExternalIDs && p.locationExternalIDs !== query.locationExternalIDs) return false;
        const min = query.minPrice ? Number(query.minPrice) : null;
        const max = query.maxPrice ? Number(query.maxPrice) : null;
        if (min !== null && p.price < min) return false;
        if (max !== null && p.price > max) return false;
        return true;
      });
      setProperties(filtered);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Box>
      {/* The main Layout component in _app.js now handles the navbar */}

      {/* ================= Hero Section ================= */}
      <Box
        w="100%"
        h={{ base: '420px', md: '560px' }}
        position="relative"
        overflow="hidden"
        bgImage="url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000')"
        bgPos="center"
        bgSize="cover"
      >
        <Box position="absolute" inset="0" bg="blackAlpha.600" />

        <SlideFade in offsetY={30}>
          <Box position="absolute" top="45%" left="50%" transform="translate(-50%, -50%)" textAlign="center" color="white" px={6}>
            <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="extrabold" letterSpacing="tight">
              Find Your Perfect Home
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} opacity={0.9} mt={3} maxW="600px">
              Curated rentals, premium neighborhoods, and a seamless experience await you.
            </Text>
          </Box>
        </SlideFade>

        {/* Search Bar */}
        <Box position="absolute" bottom={{ base: '24px', md: '40px' }} left="50%" transform="translateX(-50%)" w={{ base: '92%', md: '60%', lg: '48%' }}>
          <SearchFilters />
        </Box>
      </Box>

      {/* ================= Property List ================= */}
      <PageContainer>
        <SectionHeader title="Featured Properties" subtitle="Hand‑picked listings curated for quality & lifestyle" />

        {properties === null ? (
          <SkeletonGrid count={6} />
        ) : properties.length === 0 ? (
          <EmptyState title="No Properties Found" description="Try adjusting your search filters or check back later." />
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
            {properties.map((property) => (
              <Property property={property} key={property.id} />
            ))}
          </SimpleGrid>
        )}
      </PageContainer>

      {/* ================= CTA Section ================= */}
      {!userRole && (
        <Box textAlign="center" py={20} bg="gray.100">
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" mb={3}>
            Ready To Find Your Dream Home?
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" mb={6}>
            Create an account to save your favorite listings and get updates.
          </Text>
          <Button size="lg" colorScheme="blue" onClick={() => router.push('/auth/signup')}>
            Get Started
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Home;
 