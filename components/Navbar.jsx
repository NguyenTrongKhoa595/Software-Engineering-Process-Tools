import Link from 'next/link';
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Flex, Box, Spacer, HStack, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, VStack, Text, Avatar } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';

const notifications = [
  { sender: "RentMate System", message: "Your rent of $1200 is due tomorrow", timeAgo: "0 min" },
  { sender: "Maintenance Team", message: 'Your request "Leaking faucet" is in progress', timeAgo: "6 min" },
  { sender: "Admin", message: "New update available", timeAgo: "15 min" },
];

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
        {/* Notification Dropdown */}
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <IconButton
              aria-label="Notifications"
              icon={<MdNotifications size={24} />}
              variant="ghost"
            />
          </PopoverTrigger>

          <PopoverContent w="350px">
            <PopoverArrow />
            <PopoverHeader fontWeight="bold">Notifications</PopoverHeader>

            <PopoverBody>
              <VStack align="stretch" spacing="4">
                {notifications.map((item, i) => (
                  <HStack key={i} align="start" spacing="3">
                    <Avatar name={item.sender} size="sm" />
                    <VStack align="start" spacing="1">
                      <Text fontWeight="semibold">{item.sender}</Text>
                      <Text fontSize="sm" color="gray.600">{item.message}</Text>
                      <Text fontSize="xs" color="gray.500">{item.timeAgo}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* User Icon */}
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
