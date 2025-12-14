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
                    <MenuItem key={child.label}>
                      <Link href={child.path}>{child.label}</Link>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            );
          }

          // 🔹 NORMAL TAB
          return (
            <Link href={tab.path} key={tab.label} passHref>
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
