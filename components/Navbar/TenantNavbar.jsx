import Link from 'next/link';
import { HStack, Box } from '@chakra-ui/react';
import NavbarBase from './NavbarBase';
import { tenantTabs } from './NavbarTabs'; // import your tenantTabs array

export default function TenantNavbar() {
  return (
    <NavbarBase>
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {tenantTabs.map(({ label, path }) => (
          <Link href={path} key={label} passHref>
            <Box cursor="pointer" _hover={{ color: "blue.500" }}>
              {label}
            </Box>
          </Link>
        ))}
      </HStack>
    </NavbarBase>
  );
}
