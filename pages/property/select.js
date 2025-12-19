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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMapPin } from "react-icons/fi";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";

// Mock data for testing
const mockProperties = [
  {
    id: 1,
    address: "123 Main Street, New York, NY 10001",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
  },
  {
    id: 2,
    address: "456 Oak Avenue, Los Angeles, CA 90001",
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
  },
  {
    id: 3,
    address: "789 Pine Road, Chicago, IL 60601",
    imageUrl:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500",
  },
  {
    id: 4,
    address: "321 Elm Street, Miami, FL 33101",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500",
  },
  {
    id: 5,
    address: "654 Maple Drive, Seattle, WA 98101",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500",
  },
  {
    id: 6,
    address: "987 Cedar Lane, Boston, MA 02101",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500",
  },
];

export default function PropertySelectionPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ✅ Get user and role from localStorage (same pattern as login page)
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user?.role) {
          setUserRole(user.role);
        }
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }

    async function loadProperties() {
      try {
        // Use mock data for testing
        setProperties(mockProperties);

        // Uncomment below to use real API
        // const res = await fetch(`${API_BASE}/properties`);
        // const data = await res.json();
        // setProperties(data);
      } catch (e) {
        console.error("Failed to load properties", e);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handleSelect = (id) => {
    // ✅ Route based on user.role from localStorage
    if (userRole === "TENANT") {
      // Tenant documents page (uses query param propertyId)
      router.push(`/property/property-document-tenant?propertyId=${id}`);
    } else if (userRole === "LANDLORD") {
      // Landlord / manager documents page (uses query param propertyId)
      router.push(`/property/property-document-landlord?propertyId=${id}`);
    } else {
      // Fallback: if role is missing/unknown, choose a default
      router.push(`/property/property-document-landlord?propertyId=${id}`);
    }
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
      {/* Main content */}
      <Flex flex={1} justify="center" px={6} pt={8}>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
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