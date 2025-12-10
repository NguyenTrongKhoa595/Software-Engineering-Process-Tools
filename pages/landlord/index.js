import { Box, SimpleGrid, Flex, Text } from "@chakra-ui/react";
import { FaHome, FaUsers, FaTools, FaDollarSign } from "react-icons/fa";

const dashboardStats = [
  { label: "Properties", value: 12, icon: FaHome, color: "blue.500" },
  { label: "Tenants", value: 38, icon: FaUsers, color: "green.500" },
  { label: "Maintenance", value: 7, icon: FaTools, color: "orange.500" },
  { label: "Revenue", value: "$24,300", icon: FaDollarSign, color: "purple.500" },
];

export default function LandlordDashboard() {
  return (
    <Box p="6">
      <Text fontSize="3xl" fontWeight="bold" mb="6">
        Landlord Dashboard
      </Text>

      {/* Top Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="6">
        {dashboardStats.map((item) => (
          <Flex
            key={item.label}
            p="6"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            boxShadow="sm"
            bg="white"
            align="center"
            justify="space-between"
            _hover={{ boxShadow: "md", transform: "scale(1.02)" }}
            transition="0.2s ease"
          >
            <Box>
              <Text fontSize="lg" color="gray.600">{item.label}</Text>
              <Text fontSize="2xl" fontWeight="bold">{item.value}</Text>
            </Box>

            <Box fontSize="3xl" color={item.color}>
              <item.icon />
            </Box>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
}
