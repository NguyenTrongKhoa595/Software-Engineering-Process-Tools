import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Grid,
  VStack,
  HStack,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMapPin } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export default function PropertySelectionPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch(`${API_BASE}/properties`);
        const data = await res.json();
        setProperties(data);
      } catch (e) {
        console.error("Failed to load properties", e);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handleSelect = (id) => {
    router.push(`/property/${id}`);
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.50">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      {/* Logo */}
      <Box py={8}>
        <HStack justify="center" spacing={3}>
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            bgGradient="linear(to-tr, pink.400, purple.500, orange.300)"
          />
          <Heading size="lg" fontWeight="semibold">
            RentMate
          </Heading>
        </HStack>
      </Box>

      {/* Main content */}
      <Flex flex={1} justify="center" px={6}>
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={10}
          maxW="1200px"
        >
          {properties.map((prop) => (
            <Box
              key={prop.id}
              bg="white"
              rounded="xl"
              boxShadow="xl"
              overflow="hidden"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-5px)" }}
            >
              <Image
                src={prop.imageUrl || "/placeholder-house.jpg"}
                alt={prop.address}
                width="100%"
                height="220px"
                objectFit="cover"
              />

              <VStack spacing={4} p={5} align="stretch">
                <HStack spacing={2}>
                  <FiMapPin size={18} color="#555" />
                  <Text fontSize="sm" color="gray.700">
                    {prop.address}
                  </Text>
                </HStack>

                <Button
                  colorScheme="blue"
                  width="100%"
                  onClick={() => handleSelect(prop.id)}
                >
                  Select
                </Button>
              </VStack>
            </Box>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
}
