import Link from "next/link";
import {
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import NavbarBase from "./NavbarBase";
import { landlordTabs, propertyManagerTabs } from "./NavbarTabs";

export default function LandlordNavbar({ role }) {
  const tabs = role === "PROPERTY_MANAGER" ? propertyManagerTabs : landlordTabs;
  return (
    <NavbarBase>
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {tabs.map((tab) => {
          if (tab.label === "Properties") {
            return (
              <Menu key="Properties">
                <MenuButton
                  as={Box}
                  cursor="pointer"
                  _hover={{ color: "blue.500" }}
                >
                  Properties
                </MenuButton>

                <MenuList>
                  <MenuItem as={Link} href="/landlord/propertyLandlordView">
                    View Properties
                  </MenuItem>

                  <MenuItem as={Link} href="/landlord/propertyCreate">
                    Create Property
                  </MenuItem>
                </MenuList>
              </Menu>
            );
          }

          return (
            <Box
              key={tab.label}
              as={Link}
              href={tab.path}
              cursor="pointer"
              _hover={{ color: "blue.500" }}
            >
              {tab.label}
            </Box>
          );
        })}
      </HStack>
    </NavbarBase>
  );
}
