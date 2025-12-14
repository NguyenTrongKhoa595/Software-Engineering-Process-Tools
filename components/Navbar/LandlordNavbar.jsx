import Link from 'next/link';
import { HStack, Box } from '@chakra-ui/react';
import NavbarBase from './NavbarBase';
import { landlordTabs } from './NavbarTabs';

export default function LandlordNavbar() {
  if (typeof window === "undefined") return null;

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Choose tabs based on role
  const tabs = role === "PROPERTY_MANAGER" ? managerTabs : landlordTabs;

  return (
    <NavbarBase>
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {tabs.map(tab => (
          <Link href={tab.path} key={tab.label}>
            <Box cursor="pointer" _hover={{ color: "blue.500" }}>
              {tab.label}
            </Box>
          </Link>
        ))}
      </HStack>
    </NavbarBase>
  );
}
