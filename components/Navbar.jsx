import Link from 'next/link';
import { IconButton, Flex, Box, Spacer, HStack } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  return (
    <Flex
      px="6"
      py="3"
      align="center"
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      {/* Logo */}
      <Box fontSize="2xl" fontWeight="bold" color="blue.500">
        <Link href="/">RentMate</Link>
      </Box>

      <Spacer />

      {/* Center Menu Items */}
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {["Documents", "Communication", "Payments", "Requests"].map((label) => (
          <Box
            key={label}
            as={Link}
            href={`/${label.toLowerCase()}`}
            position="relative"
            _hover={{ color: "blue.600" }}
            transition="color 0.2s ease"
            pb="1"
            cursor="pointer"
            _before={{
              content: '""',
              position: "absolute",
              width: "0%",
              height: "2px",
              bottom: "0",
              left: "0",
              bg: "blue.500",
              transition: "width 0.25s ease-in-out",
            }}
            _hover={{
              color: "blue.600",
              _before: { width: "100%" },
            }}
          >
            {label}
          </Box>
        ))}
      </HStack>

      <Spacer />

      {/* Right Side */}
      <HStack spacing="4">
        <NotificationDropdown />
        <IconButton
          aria-label="profile"
          icon={<FaUserCircle size={28} />}
          variant="ghost"
        />
      </HStack>
    </Flex>
  );
};

export default Navbar;
