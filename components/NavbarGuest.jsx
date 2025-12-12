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
  //const router = useRouter();

  return (
    <Flex
      w="100%"
      h="90px"
      align="center"
      px={8}
      position="absolute"
      top="0"
      left="0"
      right="0"
      zIndex="10"
      bg="transparent"
      border="none"
    >
      <Spacer />

      {/* Empty right side - no buttons for guests */}
      <HStack spacing={4}>
      </HStack>
    </Flex>
  );
}
