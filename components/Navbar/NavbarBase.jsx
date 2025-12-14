import { Flex, Box, Spacer, HStack, IconButton } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import NotificationDropdown from '../NotificationDropdown';
import Logo from "./Logo";
export default function NavbarBase({ children }) {
  const router = useRouter();

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
      <Logo />

      <Spacer />

      {/* Center */}
      {children}

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
            <MenuItem
              onClick={() => {
                if (typeof window === "undefined") return;

                const user = JSON.parse(localStorage.getItem("user"));
                if (!user?.id) return;

                router.push(`/profile/${user.id}`);
              }}
            >
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
}
