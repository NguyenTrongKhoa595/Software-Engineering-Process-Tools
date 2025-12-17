import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box, Flex, HStack, Spacer, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar,
  useBreakpointValue, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay,
  DrawerContent, DrawerCloseButton, VStack, Text
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { getNavItems } from '@/constants/nav';

const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} passHref>
      <Flex
        as="a"
        align="center"
        px="3"
        py="2"
        borderRadius="full"
        bg={isActive ? 'blue.50' : 'transparent'}
        color={isActive ? 'blue.600' : 'gray.700'}
        fontWeight={isActive ? 'semibold' : 'medium'}
        transition="all 0.2s ease"
        _hover={{ bg: 'gray.100' }}
      >
        {children}
      </Flex>
    </Link>
  );
};

export default function Navbar() {
  const router = useRouter();
  const { user, role, logout, isAuthenticated } = useAuth();
  const navItems = getNavItems(role);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const renderAuthButtons = () => (
    isAuthenticated ? (
      <Menu>
        <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
          <Avatar size={'sm'} name={user?.fullName || user?.email} src={user?.avatarUrl} />
        </MenuButton>
        <MenuList boxShadow="lg">
          <MenuItem onClick={() => router.push(`/user/profile/${user?.id}`)}>My Profile</MenuItem>
          <MenuDivider />
          <MenuItem color="red.500" onClick={handleLogout}>Sign Out</MenuItem>
        </MenuList>
      </Menu>
    ) : (
      <HStack spacing={2}>
        <Button variant="ghost" onClick={() => router.push('/auth/login')}>Log In</Button>
        <Button colorScheme="blue" onClick={() => router.push('/auth/signup')}>Sign Up</Button>
      </HStack>
    )
  );

  return (
    <Flex
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg="whiteAlpha.800"
      backdropFilter="blur(10px)"
      boxShadow="sm"
      borderBottomWidth="1px"
      borderColor="gray.100"
      h="72px"
      align="center"
      px={{ base: 4, md: 8 }}
    >
      <Link href="/" passHref>
        <Box as="a" fontSize="2xl" fontWeight="bold" color="blue.600">
          RentMate
        </Box>
      </Link>

      <Spacer />

      {isMobile ? (
        <>
          <IconButton
            aria-label="Open menu"
            icon={<FiMenu />}
            variant="ghost"
            onClick={onOpen}
          />
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Navigation</DrawerHeader>
              <DrawerBody>
                <VStack align="stretch" spacing={4} mt={4}>
                  {isAuthenticated ? navItems.map(({ label, href }) => (
                    <NavLink key={label} href={href}>{label}</NavLink>
                  )) : (
                    <>
                      <NavLink href="/auth/login">Log In</NavLink>
                      <NavLink href="/auth/signup">Sign Up</NavLink>
                    </>
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <HStack spacing={1}>
          {isAuthenticated && navItems.map(({ label, href }) => (
            <NavLink key={label} href={href}>{label}</NavLink>
          ))}
          <Box w={4} />
          {renderAuthButtons()}
        </HStack>
      )}
    </Flex>
  );
}

