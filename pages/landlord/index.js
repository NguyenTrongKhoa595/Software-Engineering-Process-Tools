import { Box, SimpleGrid, Flex, Text, Button } from "@chakra-ui/react";
import { FaHome, FaUsers, FaTools, FaDollarSign } from "react-icons/fa";
import Property from "../../components/Property";
import { mockProperties } from "../../utils/mockProperties";

const dashboardStats = [
  { label: "Properties", value: 12, icon: FaHome, color: "blue.500" },
  { label: "Tenants", value: 38, icon: FaUsers, color: "green.500" },
  { label: "Maintenance", value: 7, icon: FaTools, color: "orange.500" },
  { label: "Revenue", value: "$24,300", icon: FaDollarSign, color: "purple.500" },
];

export default function LandlordDashboard() {
  return (
    <>
        <Box p="6">
            <Text fontSize="3xl" fontWeight="bold" mb="6">
            Landlord Dashboard
            </Text>

            {/* Top Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="6" mb="10">
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

            {/* Featured Properties Section */}
            <Flex align="center" justify="space-between" mt="6" mb="4">
            <Text fontSize="2xl" fontWeight="bold">
                Featured Properties
            </Text>

            <Text
                fontSize="md"
                color="blue.500"
                fontWeight="medium"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
            >
                View All &gt;
            </Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
            {mockProperties.map((property) => (
                <Property key={property.id} property={property} />
            ))}
            </SimpleGrid>
        </Box>

        {/* Bottom Section: Payment History & Maintenance Requests */}
        <Flex mt="10" gap="6" flexWrap="wrap">

        {/* Payment History - Left Section */}
        <Box
            flex={{ base: "1 1 100%", md: "1 1 48%" }}
            p="6"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            bg="white"
            boxShadow="sm"
        >
            <Text fontSize="xl" fontWeight="bold" mb="4">
            Payment History
            </Text>

            {/* Mock Payment Data */}
            {[
            { tenant: "John Doe", property: "Beautiful Family Home", amount: "$1200", date: "2025-12-01", status: "Paid" },
            { tenant: "Jane Smith", property: "Luxury Villa with Pool", amount: "$2500", date: "2025-11-25", status: "Pending" },
            { tenant: "Ali Khan", property: "Residential Plot in Prime Location", amount: "$800", date: "2025-11-20", status: "Paid" },
            ].map((payment, index) => (
            <Flex
                key={index}
                justify="space-between"
                p="3"
                mb="2"
                bg={index % 2 === 0 ? "gray.50" : "white"}
                rounded="md"
                align="center"
            >
                <Box>
                    <Text fontWeight="semibold">{payment.tenant}</Text>
                    <Text fontSize="sm" color="gray.600">{payment.property}</Text>
                </Box>

                <Box textAlign="right">
                    <Text fontWeight="bold">{payment.amount}</Text>
                    <Text fontSize="sm" color="gray.500">{payment.date}</Text>
                    <Text
                        fontSize="sm"
                        color={payment.status === "Paid" ? "green.500" : "orange.500"}
                        fontWeight="semibold"
                    >
                        {payment.status}
                    </Text>
                </Box>
            </Flex>
            ))}
            {/* View All Button */}
            <Flex justify="flex-end" mt="4">
            <Button size="sm" colorScheme="blue" variant="outline">
                View All
            </Button>
            </Flex>
        </Box>

        {/* Maintenance Request - Right Section */}
        <Box
            flex={{ base: "1 1 100%", md: "1 1 48%" }}
            p="6"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            bg="white"
            boxShadow="sm"
        >
            <Text fontSize="xl" fontWeight="bold" mb="4">
            Maintenance Requests
            </Text>

            {/* Mock Maintenance Data */}
            {[
                { tenant: "John Doe", property: "Beautiful Family Home", issue: "Leaking faucet", date: "2025-12-05", status: "In Progress" },
                { tenant: "Jane Smith", property: "Luxury Villa with Pool", issue: "Air conditioning not working", date: "2025-12-03", status: "Completed" },
                { tenant: "Ali Khan", property: "Residential Plot in Prime Location", issue: "Broken gate", date: "2025-12-01", status: "Pending" },
            ].map((request, index) => (
                <Flex
                key={index}
                justify="space-between"
                p="3"
                mb="2"
                bg={index % 2 === 0 ? "gray.50" : "white"}
                rounded="md"
                align="center"
                >
                <Box>
                    <Text fontWeight="semibold">{request.tenant}</Text>
                    <Text fontSize="sm" color="gray.600">{request.property}</Text>
                    <Text fontSize="sm" color="gray.700">{request.issue}</Text>
                </Box>

                <Box textAlign="right">
                    <Text fontSize="sm" color="gray.500">{request.date}</Text>
                    <Text
                    fontSize="sm"
                    color={
                        request.status === "Completed"
                        ? "green.500"
                        : request.status === "In Progress"
                        ? "orange.500"
                        : "red.500"
                    }
                    fontWeight="semibold"
                    >
                    {request.status}
                    </Text>
                </Box>
                </Flex>
            ))}

            {/* Optional button to view all requests */}
            <Flex justify="flex-end" mt="4">
                <Button size="sm" colorScheme="blue" variant="outline">
                View All
                </Button>
            </Flex>
        </Box>
        </Flex>
    </>
  );
}
