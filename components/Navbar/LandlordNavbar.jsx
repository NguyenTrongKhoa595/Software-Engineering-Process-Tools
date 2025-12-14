import Link from "next/link";
import {
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import NavbarBase from "./NavbarBase";
import { landlordTabs } from "./NavbarTabs";

export default function LandlordNavbar() {
  if (typeof window === "undefined") return null;

  return (
    <NavbarBase>
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {landlordTabs.map((tab) => {
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
                  <Link href="/landlord/propertyLandlordView" passHref>
                    <MenuItem>View Properties</MenuItem>
                  </Link>

                  <Link href="/landlord/propertyCreate" passHref>
                    <MenuItem>Create Property</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            );
          }

          return (
            <Link href={tab.path} key={tab.label}>
              <Box cursor="pointer" _hover={{ color: "blue.500" }}>
                {tab.label}
              </Box>
            </Link>
          );
        })}
      </HStack>
    </NavbarBase>
  );
}
