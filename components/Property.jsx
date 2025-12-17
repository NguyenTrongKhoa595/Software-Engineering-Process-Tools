import { Image, Box, Flex, Text, Badge } from "@chakra-ui/react";
import { FaMapMarkerAlt, FaTag } from "react-icons/fa";
import Link from 'next/link';
import Card from '../src/components/ui/Card';

export default function Property({ property = {} }) {
  const {
    id,
    title,
    price,
    coverPhoto,
    coverImageUrl,
    category,
    address,
    location,
    availability,
    status,
  } = property;

  const imgUrl = coverImageUrl || coverPhoto?.url || '/placeholder-property.jpg';
  const availText = (availability || status || 'AVAILABLE').toString().toLowerCase();
  const isAvailable = availText.includes('available');

  return (
    <Link href={`/property/${id}`} style={{ textDecoration: "none" }}>
      <Card clickable overflow="hidden">
        {/* Image Section */}
        <Box position="relative">
          <Image src={imgUrl} alt={title || 'Property'} w="100%" h="200px" objectFit="cover" />
          <Badge
            position="absolute"
            top="3"
            right="3"
            colorScheme={isAvailable ? "green" : "orange"}
            px="3"
            py="1"
            rounded="md"
            fontWeight="600"
            textTransform="capitalize"
          >
            {availText}
          </Badge>
        </Box>

        <Box p="4">
          {/* Title */}
          <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
            {title || 'Untitled Property'}
          </Text>

          {/* Location */}
          <Flex align="center" mt={1} gap={2}>
            <FaMapMarkerAlt size={14} color="#4A5568" />
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {address || location || 'Address not available'}
            </Text>
          </Flex>

          {/* Category */}
          {category && (
            <Flex align="center" mt={1} gap={2}>
              <FaTag size={14} color="#4A5568" />
              <Text fontSize="sm" color="gray.600">{category}</Text>
            </Flex>
          )}

          {/* Price */}
          {price != null && (
            <Text fontSize="xl" fontWeight="bold" mt="3" color="blue.600">
              ${Number(price).toLocaleString()}
            </Text>
          )}
        </Box>
      </Card>
    </Link>
  );
}
