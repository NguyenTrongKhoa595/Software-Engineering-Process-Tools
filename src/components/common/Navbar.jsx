// src/components/common/Navbar.jsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  HStack,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { getNavItems } from '../../constants/nav';

export default function Navbar() {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const navItems = getNavItems(role);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      h="72px"
      align="center"
      px={{ base: 4, md: 8 }}
    >
      {/* Left: Brand */}
      <Link href="/" passHref>
        <Box as="a" fontSize="2xl" fontWeight="bold" color="brand.500">
          RentMate
        </Box>
      </Link>

      {/* Center: Nav Links (Desktop) */}
      {!isMobile && (
        <HStack spacing={8} mx="auto">
          {navItems.map(({ label, href }) => (
            <Link href={href} key={label} passHref>
              <Box
                as="a"
                fontSize="md"
                fontWeight={router.pathname.startsWith(href) ? 'semibold' : 'medium'}
                color={router.pathname.startsWith(href) ? 'brand.500' : 'gray.600'}
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  transform: router.pathname.startsWith(href) ? 'scaleX(1)' : 'scaleX(0)',
                  height: '2px',
                  bottom: '-4px',
                  left: 0,
                  bg: 'brand.500',
                  transformOrigin: 'bottom center',
                  transition: 'transform 0.25s ease-out',
                }}
                _hover={{ color: 'brand.500', _after: { transform: 'scaleX(1)' } }}
              >
                {label}
              </Box>
            </Link>
          ))}
        </HStack>
      )}

      <Spacer />

      {/* Right: User Menu */}
      <Menu>
        <MenuButton
          as={Button}
          rounded={'full'}
          variant={'link'}
          cursor={'pointer'}
          minW={0}
        >
          <Avatar
            size={'sm'}
            name={user?.fullName || user?.email}
            src={user?.avatarUrl}
          />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => router.push(`/profile/${user?.id}`)}>
            My Profile
          </MenuItem>
          <MenuDivider />
          <MenuItem color="red.500" onClick={handleLogout}>
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

