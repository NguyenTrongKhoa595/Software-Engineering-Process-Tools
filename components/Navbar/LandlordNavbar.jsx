import Link from 'next/link';
import { HStack, Box } from '@chakra-ui/react';
import NavbarBase from './NavbarBase';

const tabs = ["Employees", "Properties", "Documents", "Payments", "Communication", "Maintenance", "Property Requests"];

export default function LandlordNavbar() {
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
