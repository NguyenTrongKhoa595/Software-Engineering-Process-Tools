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
import { tenantTabs } from "./NavbarTabs";

export default function TenantNavbar() {
  return (
    <NavbarBase>
      <HStack spacing="8" fontSize="lg" fontWeight="medium">
        {tenantTabs.map((tab) => {
          // 🔹 DROPDOWN TAB
          if (tab.children) {
            return (
              <Menu key={tab.label} isLazy>
                <MenuButton
                  as={Box}
                  cursor="pointer"
                  _hover={{ color: "blue.500" }}
                >
                  {tab.label}
                </MenuButton>

                <MenuList>
                  {tab.children.map((child) => (
                    <MenuItem
                      key={child.label}
                      as={Link}
                      href={child.path}
                    >
                      {child.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            );
          }

          // 🔹 NORMAL TAB
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
