import Link from 'next/link';
import { IconButton, Flex, Box, Spacer, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const router = useRouter();
  const { pathname } = router;
  // Determine user role from localStorage (fallback to LANDLORD)
  let userRole = 'LANDLORD';
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('role');
    if (stored) userRole = stored;
  }

  const baseTabs = ["Properties", "Documents", "Communication", "Payments", "Requests"];
  const tabs = userRole === 'PROPERTY_MANAGER' ? baseTabs : ["Employees", ...baseTabs];
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
        <IconButton
          aria-label="profile"
          icon={<FaUserCircle size={28} />}
          variant="ghost"
        />
      </HStack>
    </Flex>
  );
};

export default function Navbar() {

  const handleLogout = () => {
    console.log("Logging out...");
    // TODO: attach your logout API here
  };

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
{/*        */}{/* LEFT LOGO */}
{/*       <Flex align="center" gap={3}> */}
{/*         <Image */}
{/*           src="https://cdn-icons-png.flaticon.com/512/727/727590.png" */}
{/*           w="45px" */}
{/*           alt="logo" */}
{/*         /> */}
{/*         <Box fontSize="2xl" fontWeight="bold"> */}
{/*           <Link href="/">Realtor</Link> */}
{/*         </Box> */}
{/*       </Flex> */}

      <Spacer />

      {/* RIGHT ICON BUTTONS */}
      <HStack spacing={4}>

        {/* Message / Money / Notification / Profile */}
        {[BsChatDots, BsCurrencyDollar, BsBell, BsPerson].map((Icon, i) => (
          <Flex
            key={i}
            w="42px"
            h="42px"
            border="1px solid #ddd"
            borderRadius="full"
            align="center"
            justify="center"
            cursor="pointer"
            transition="0.2s"
            color="white"
            _hover={{ bg: "gray.50" }}
          >
            <Icon size={18} />
          </Flex>
        ))}

        {/* File Icon */}
        <Flex
          w="42px"
          h="42px"
          border="1px solid #ddd"
          borderRadius="full"
          align="center"
          justify="center"
          cursor="pointer"
          transition="0.2s"
          color="white"
          _hover={{ bg: "gray.50" }}
        >
          <BsFileEarmarkText size={18} />
        </Flex>

        <Box
          h="28px"
          borderRight="2px solid rgba(255,255,255,0.6)"
          mx="6"
        />

        {/* SIGN OUT BUTTON */}
        <Flex
          w="42px"
          h="42px"
          border="1px solid #ddd"
          borderRadius="full"
          align="center"
          justify="center"
          cursor="pointer"
          onClick={handleLogout}
          transition="0.2s"
          color="white"
          _hover={{ bg: "red.50", color:"red.500", borderColor:"red.300" }}
          title="Sign Out"
        >
          <FiLogOut size={18} />
        </Flex>

      </HStack>
    </Flex>
  );
}
