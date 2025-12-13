import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Grid,
  GridItem,
  VStack,
  HStack,
  Icon,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiHome,
  FiCalendar,
  FiMail,
  FiPhone,
  FiCornerDownRight,
} from 'react-icons/fi';
import { fetchApi } from '../utils/fetchApi';
import { mockData } from '../utils/mockData';

export default function PropertyDetail({ property }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  if (!property) {
    return (
      <Container maxW="container.xl" py={6}>
        <Heading size="lg">Property not found</Heading>
      </Container>
    );
  }

  // Build thumbnails array from available photos or fallback to coverPhoto
  const thumbnails = (property.photos && property.photos.length > 0)
    ? property.photos.map(p => p.url)
    : [property.coverPhoto?.url || ''];

  const mainImageSrc = thumbnails[activeIndex] || thumbnails[0] || 'https://via.placeholder.com/1200x630?text=No+Image';

  return (
    <>
      <Head>
        <title>{property.title || 'Property - Details'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box bg="gray.50" minH="100vh">
        <Container maxW="1400px" px={{ base: 4, md: 10 }} py={8}>
          {/* Header Section */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            mb={8}
          >
            <Box>
              <Heading size="xl" color="gray.800" mb={2}>
                {property.title}
              </Heading>
              <HStack spacing={1} color="gray.600">
                <Icon as={FiMapPin} boxSize={4} />
                <Text>{property.location || 'Location not provided'}</Text>
              </HStack>
            </Box>
            <Box mt={{ base: 4, md: 0 }}>
              <Text fontSize="3xl" fontWeight="bold" color="teal.500">
                ${property.price?.toLocaleString()}
              </Text>
            </Box>
          </Flex>

          <Flex direction={{ base: 'column', lg: 'row' }} gap={12} columnGap={{ lg: 8 }}>
            {/* Left Column - Images and Details */}
            <Box flex="1" maxW={{ lg: '65%' }} pr={{ lg: 8 }}>
              {/* Main Image */}
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="lg"
                mb={4}
              >
                <Image
                  src={mainImageSrc}
                  alt="Property main view"
                  w="100%"
                  h="400px"
                  objectFit="cover"
                />
              </Box>

              {/* Thumbnails */}
              <Flex gap={2} overflowX="auto" pb={2}>
                {thumbnails.map((src, i) => (
                  <Image
                    key={i}
                    src={src || 'https://via.placeholder.com/640x360?text=No+Image'}
                    alt={`Property view ${i + 1}`}
                    w="128px"
                    h="80px"
                    objectFit="cover"
                    borderRadius="lg"
                    cursor="pointer"
                    border="2px"
                    borderColor={i === activeIndex ? 'blue.500' : 'transparent'}
                    transform={i === activeIndex ? 'scale(1.05)' : 'scale(1)'}
                    transition="all 0.2s"
                    onClick={() => setActiveIndex(i)}
                    _hover={{ transform: 'scale(1.05)' }}
                  />
                ))}
              </Flex>

              {/* Description */}
              <Box mt={8}>
                <Heading size="lg" color="gray.800" mb={4}>
                  Description
                </Heading>
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                  <Text color="gray.700" lineHeight="tall">
                    {property.description || 'No description available.'}
                  </Text>
                </Box>
              </Box>
            </Box>

            {/* Right Column - Contact Card */}
            <Box flex="1" maxW={{ lg: '35%' }} ml={{ lg: 8 }}>
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="lg"
                p={6}
                position="sticky"
                top="20px"
              >
                <Heading size="lg" color="gray.800" mb={4}>
                  Contact the Landlord
                </Heading>
                
                <HStack mb={4} align="center">
                  <Avatar
                    size="lg"
                    src={property.landlordPhoto || 'https://via.placeholder.com/80'}
                    name={property.landlordName || 'Owner'}
                  />
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="medium" color="gray.800">
                      {property.landlordName || 'Owner'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {property.landlordTitle || 'Property Owner'}
                    </Text>
                  </VStack>
                </HStack>

                <VStack spacing={3} mb={6} align="stretch">
                  <HStack color="gray.700">
                    <Icon as={FiMail} boxSize={4} color="teal.500" />
                    <Text fontSize="sm">{property.landlordEmail || 'n/a'}</Text>
                  </HStack>
                  <HStack color="gray.700">
                    <Icon as={FiPhone} boxSize={4} color="teal.500" />
                    <Text fontSize="sm">{property.landlordPhone || 'n/a'}</Text>
                  </HStack>
                </VStack>

                <Button
                  w="100%"
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<Icon as={FiCornerDownRight} />}
                  onClick={() => {
                    sessionStorage.setItem('paymentData', JSON.stringify({
                      price: property.price,
                      id: property.id,
                      title: property.title
                    }));
                    router.push('/payment');
                  }}
                >
                  Rent This Property
                </Button>

                <Box mt={4} textAlign="center">
                  <Text fontSize="sm" color="gray.500">
                    Response time: usually within 24 hours
                  </Text>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  // Use mockData instead of fetchApi
  const properties = mockData || [];

  // find property by id (support numeric or string ids)
  const property = properties.find((h) => String(h.id) === String(id)) || null;

  // Return property directly as it already matches the expected structure
  return {
    props: {
      property: property,
    },
  };
}