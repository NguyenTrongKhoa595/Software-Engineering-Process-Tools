// pages/properties.js
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  SimpleGrid,
  Image,
  Text,
  HStack,
  VStack,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
// Removed HeaderLogo per request

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/properties`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      const data = await res.json();
      setProperties(data);
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to load properties",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (propertyId) => {
    // Navigate to property details or perform action
    toast({
      status: "info",
      title: `Property ${propertyId} selected`,
    });
  };

  const handleRemove = async (propertyId) => {
    if (!confirm("Are you sure you want to remove this property?")) return;

    try {
      const res = await fetch(`${API_BASE}/properties/${propertyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove property");

      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      toast({
        status: "success",
        title: "Property removed",
      });
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to remove property",
      });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">

      {/* Main Content */}
      <Box maxW="1400px" mx="auto" p={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Properties</Heading>
          <Button colorScheme="blue" leftIcon={<Text>+</Text>}>
            New
          </Button>
        </Flex>

        {/* Properties Grid */}
        {loading ? (
          <Text textAlign="center" py={10}>
            Loading properties...
          </Text>
        ) : properties.length === 0 ? (
          <Text textAlign="center" py={10}>
            No properties found
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 5 }} spacing={6}>
            {properties.map((property) => (
              <Box
                key={property.id}
                bg="white"
                rounded="lg"
                overflow="hidden"
                shadow="sm"
                border="1px"
                borderColor="gray.200"
              >
                {/* Property Image */}
                <Box position="relative" h="200px" bg="gray.200">
                  <Image
                    src={property.imageUrl || "/placeholder-property.jpg"}
                    alt={property.address}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>

                {/* Property Details */}
                <VStack align="stretch" p={4} spacing={3}>
                  <HStack spacing={2} color="gray.600" fontSize="sm">
                    <FiMapPin />
                    <Text noOfLines={1}>{property.address}</Text>
                  </HStack>

                  {/* Action Buttons */}
                  <VStack spacing={2}>
                    <Button
                      colorScheme="blue"
                      w="100%"
                      onClick={() => handleSelect(property.id)}
                    >
                      Select
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="solid"
                      w="100%"
                      onClick={() => handleRemove(property.id)}
                    >
                      Remove
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}
