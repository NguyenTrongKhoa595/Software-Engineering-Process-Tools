import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex, Text, Badge } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { FaBed, FaBath } from 'react-icons/fa';
import { BsGridFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import millify from 'millify';
import DefaultImage from '../assets/images/house.jpg';

const Property = ({ property }) => {
  const {
    id,
    coverPhoto,
    price,
    rentFrequency,
    rooms,
    title,
    baths,
    area,
    agency,
    isVerified,
  } = property;

  return (
    <Link href={`/property/${id}`} passHref>
      <Flex
        direction="column"
        w="340px"
        bg="white"
        borderRadius="12px"
        overflow="hidden"
        boxShadow="0 4px 15px rgba(0,0,0,0.08)"
        _hover={{ transform: "scale(1.02)", boxShadow:"0 6px 18px rgba(0,0,0,0.12)" }}
        transition="0.25s"
        cursor="pointer"
      >

        {/* Image */}
        <Box>
          <Image
            src={coverPhoto?.url || DefaultImage}
            width={400}
            height={260}
            alt="property"
            unoptimized
            style={{
              objectFit: "cover",
              width: "100%",
              height: "220px",
            }}
          />
        </Box>

        {/* Content */}
        <Flex direction="column" p="4" gap="6px">

          {/* Price + Agency + Verified */}
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="6px">
              {isVerified && <GoVerified color="green" />}
              <Text fontSize="xl" fontWeight="bold">
                AED {millify(price)}
                <Text as="span" fontSize="sm" color="gray.500">
                  {rentFrequency ? ` /${rentFrequency}` : ''}
                </Text>
              </Text>
            </Flex>

            <Avatar size="sm" src={agency?.logo?.url || ''} />
          </Flex>

          {/* Info Row */}
          <Flex
            align="center"
            justify="space-between"
            fontSize="sm"
            fontWeight="medium"
            color="gray.600"
            mt="2"
          >
            <Flex align="center" gap="5px">
              <FaBed /> {rooms}
            </Flex>
            <Flex align="center" gap="5px">
              <FaBath /> {baths}
            </Flex>
            <Flex align="center" gap="5px">
              <BsGridFill /> {millify(area)} sqft
            </Flex>
          </Flex>

          {/* Title */}
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="gray.800"
            mt="2"
          >
            {title.length > 45 ? title.substring(0, 45) + "..." : title}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Property;
