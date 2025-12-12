import { Image } from "@chakra-ui/react";
import { Box, Flex, Text, Badge } from '@chakra-ui/layout';
import { FaMapMarkerAlt, FaTag } from "react-icons/fa";
import Link from 'next/link';
export default function Property({ property }) {
  const {
    title,
    price,
    coverPhoto,
    category,
    location,
    availability
  } = property;

  return (
    <Link href={`/property/${property.id}`} style={{ textDecoration: "none" }}>
      <Box
        border="1px solid"
        borderColor="gray.200"
        rounded="lg"
        overflow="hidden"
        bg="white"
        boxShadow="sm"
        _hover={{ boxShadow: "md", transform: "scale(1.02)" }}
        transition="0.2s ease"
        cursor="pointer"
        width="400px"
        m="3"
      >
        {/* Image Section */}
        <Box position="relative">
          <Image
            src={coverPhoto?.url}
            alt={title}
            width="100%"
            height="200px"
            objectFit="cover"
          />

          {/* Availability Badge */}
          <Badge
            position="absolute"
            top="3"
            right="3"
            colorScheme={availability === "available" ? "green" : "orange"}
            px="3"
            py="1"
            rounded="md"
            fontWeight="600"
          >
            {availability}
          </Badge>
        </Box>

        <Box p="4">

          {/* Title */}
          <Text fontSize="lg" fontWeight="bold" mb="1">
            {title}
          </Text>

          {/* Location */}
          <Flex align="center" mb="1">
            <FaMapMarkerAlt size={14} color="#4A5568" style={{ marginRight: "6px" }} />
            <Text fontSize="sm" color="gray.600">
              {location}
            </Text>
          </Flex>

          {/* Property Type */}
          <Flex align="center" mb="1">
            <FaTag size={14} color="#4A5568" style={{ marginRight: "6px" }} />
            <Text fontSize="sm" color="gray.600">
              {category}
            </Text>
          </Flex>

          {/* Price */}
          <Text fontSize="xl" fontWeight="bold" mt="2">
            ${price.toLocaleString()}
          </Text>
        </Box>
      </Box>
    </Link>
  );
}
