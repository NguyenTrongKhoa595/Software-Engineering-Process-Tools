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
import { apiGet, apiDelete } from "../utils/apiClient";
import PageContainer from "../src/components/ui/PageContainer";
import SectionHeader from "../src/components/ui/SectionHeader";
import SkeletonGrid from "../src/components/ui/SkeletonGrid";
import EmptyState from "../src/components/ui/EmptyState";
import Property from "../components/Property";

// Removed HeaderLogo per request

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
      const data = await apiGet('/properties?size=20&page=0');
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];
      setProperties(list);
    } catch (e) {
      console.error(e);
      setProperties([]); // Clear properties on error
      toast({
        status: 'error',
        title: 'Failed to load properties',
        description: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <PageContainer>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Properties</Heading>
          <Button colorScheme="blue">New</Button>
        </Flex>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : properties.length === 0 ? (
          <EmptyState title="No properties found" description="Try adjusting your filters or check back later." />
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
            {properties.map((property) => (
              <Property property={property} key={property.id} />
            ))}
          </SimpleGrid>
        )}
      </PageContainer>
    </Box>
  );
}
