import Link from 'next/link';
import {
  Flex,
  Box,
  Image,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { BsChatDots, BsCurrencyDollar, BsBell, BsPerson, BsFileEarmarkText } from "react-icons/bs";
import { FiLogOut, FiDollarSign } from "react-icons/fi";
import NotificationDropdownTenant from './NotificationDropdownTenant';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
    }
    router.push('/login');
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

        {/* Message */}
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
          onClick={() => router.push('/messages')}
        >
          <BsChatDots size={18} />
        </Flex>

        {/* Payments */}
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
          //onClick={() => router.push('/payments')} //noi cua khoi vo
        >
          <FiDollarSign size={18} />
        </Flex>

        {/* Notification Dropdown */}
        <NotificationDropdownTenant />

        {/* Profile */}
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
          onClick={() => {
            const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
            if (userId) router.push(`/profile/${userId}`);
          }}
        >
          <BsPerson size={18} />
        </Flex>

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
          onClick={() => router.push('/property/select?returnTo=documents-tenant')}
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
 