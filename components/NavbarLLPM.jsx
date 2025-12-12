import Link from 'next/link';
import { IconButton, Flex, Box, Spacer, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

const NavbarLLPM = () => {
  const router = useRouter();
  const { pathname } = router;
  // Determine user role from localStorage (fallback to LANDLORD)
  let userRole = 'LANDLORD';
  let userId = null;
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('role');
    if (stored) userRole = stored;
    userId = window.localStorage.getItem('userId');
  }
 
  const baseTabs = ["Properties", "Documents", "Messages", "Payments", "Requests"];
  const tabs = userRole === 'PROPERTY_MANAGER' ? baseTabs : ["Employees", ...baseTabs];
  
  // Map tab names to their actual routes
  const pathMap = {
    'Documents': '/property/select?returnTo=documents',
  };

  const getTabPath = (label) => {
    return pathMap[label] || `/${label.toLowerCase()}`;
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
        <Link href="/">RentMate</Link>
      </Box>
 
      <Spacer />
 
      {/* Center Menu Items */}
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {tabs.map((label) => (
        <Link href={getTabPath(label)} key={label} passHref>
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
        <IconButton
          aria-label="profile"
          icon={<FaUserCircle size={28} />}
          variant="ghost"
          onClick={() => router.push(`/profile/${userId}`)}
          cursor="pointer"
        />
      </HStack>
    </Flex>
  );
};
 
export default NavbarLLPM;