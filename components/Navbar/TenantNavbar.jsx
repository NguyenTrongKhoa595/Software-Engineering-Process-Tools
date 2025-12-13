import Link from 'next/link';
import { HStack, Box } from '@chakra-ui/react';
import NavbarBase from './NavbarBase';

const tabs = ["My Rental", "Payments", "Request Maintenance", "Messages", "My Documents"];

export default function TenantNavbar() {
  return (
    <NavbarBase>
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {tabs.map(label => (
          <Link href={`/${label.toLowerCase()}`} key={label}>
            <Box cursor="pointer" _hover={{ color: "blue.500" }}>
              {label}
            </Box>
          </Link>
        ))}
      </HStack>
    </NavbarBase>
  );
}
