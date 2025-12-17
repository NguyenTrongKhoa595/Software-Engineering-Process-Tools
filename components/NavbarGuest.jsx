import Link from 'next/link';
import {
  Flex,
  Box,
  Image,
  HStack,
  Spacer,
} from "@chakra-ui/react";
//import { useRouter } from 'next/router';

export default function NavbarGuest() {
  return (
    <Flex
      w="100%"
      h="80px"
      align="center"
      px={{ base: 4, md: 8 }}
      position="absolute"
      top="0"
      left="0"
      right="0"
      zIndex="10"
      bg="transparent"
      border="none"
    >
      {/* Left Brand */}
      <HStack spacing={3} color="white">
        <Box fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold">
          RentMate
        </Box>
      </HStack>

      <Spacer />

      {/* Right actions (hidden for now, reserved for CTA) */}
      <HStack spacing={3}>
        {/* Placeholder for future guest actions */}
      </HStack>
    </Flex>
  );
}
