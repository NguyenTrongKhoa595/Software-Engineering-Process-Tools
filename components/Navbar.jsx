import Link from 'next/link';
import { IconButton, Flex, Box, Spacer, HStack } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const router = useRouter();
  // Determine user role from localStorage (fallback to LANDLORD)
  let userRole = null;

  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user"));
    userRole = user?.role || null;
  }

  const baseTabs = ["Properties", "Documents", "Messages", "Payments", "Requests"];
  const tabs = userRole === 'PROPERTY_MANAGER' ? baseTabs : ["Employees", ...baseTabs];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.replace("/");
  };
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
        RentMate
      </Box>

      <Spacer />

      {/* Center Menu Items */}
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {tabs.map((label) => (
        <Link href={`/${label.toLowerCase()}`} key={label} passHref>
          <Box
            position="relative"
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
            transition="color 0.2s ease"
          >
            {label}
          </Box>
        </Link>
        ))}
      </HStack>

      <Spacer />

      {/* Right Side */}
      <HStack spacing="4">
        <NotificationDropdown />

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Profile"
            icon={<FaUserCircle size={28} />}
            variant="ghost"
          />

          <MenuList>
            <MenuItem onClick={() => router.push("/profile")}>
              View Profile
            </MenuItem>

            <MenuItem color="red.500" onClick={handleLogout}>
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Navbar;
