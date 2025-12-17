import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  Button,
  Heading,
  Icon,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import useRequireAuth from '../../src/hooks/useRequireAuth';
import { FaHome, FaUsers, FaTools, FaDollarSign } from 'react-icons/fa';
import { useRouter } from 'next/router';
import PageContainer from '../../src/components/ui/PageContainer';
import Card from '../../src/components/ui/Card';
import SectionHeader from '../../src/components/ui/SectionHeader';

// --- Mock Data ---
const dashboardStats = [
  { label: 'Total Properties', value: 12, icon: FaHome, color: 'blue.500' },
  { label: 'Active Tenants', value: 38, icon: FaUsers, color: 'green.500' },
  { label: 'Open Requests', value: 7, icon: FaTools, color: 'orange.500' },
  { label: 'Monthly Revenue', value: '$24,300', icon: FaDollarSign, color: 'purple.500' },
];

const mockActivity = [
  { type: 'payment', user: 'John Doe', amount: 1200, status: 'COMPLETED', date: '2025-12-01' },
  { type: 'request', user: 'Jane Smith', issue: 'Leaking faucet', status: 'PENDING', date: '2025-11-28' },
  { type: 'application', user: 'Ali Khan', property: 'Downtown Loft', status: 'APPROVED', date: '2025-11-25' },
];

// --- Sub-components ---
const StatCard = ({ item }) => (
  <Card p={6}>
    <Flex align="center" justify="space-between">
      <VStack align="start" spacing={1}>
        <Text fontSize="md" color="gray.500">{item.label}</Text>
        <Text fontSize="2xl" fontWeight="bold">{item.value}</Text>
      </VStack>
      <Icon as={item.icon} boxSize={8} color={item.color} />
    </Flex>
  </Card>
);

const ActivityItem = ({ item }) => (
  <Flex justify="space-between" align="center" py={3}>
    <VStack align="start" spacing={0}>
      <Text fontWeight="medium">{item.user}</Text>
      <Text fontSize="sm" color="gray.500">
        {item.type === 'payment' && `Made a payment of $${item.amount}`}
        {item.type === 'request' && `New request: ${item.issue}`}
        {item.type === 'application' && `Applied for ${item.property}`}
      </Text>
    </VStack>
    <Badge colorScheme={item.status === 'COMPLETED' || item.status === 'APPROVED' ? 'green' : 'orange'}>
      {item.status}
    </Badge>
  </Flex>
);

// --- Main Page Component ---
export default function LandlordDashboard() {
  const canRender = useRequireAuth();
  const router = useRouter();
  if (!canRender) return null;

  return (
    <PageContainer>
      <Heading as="h1" size="lg" mb={6}>Landlord Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={10}>
        {dashboardStats.map((item) => (
          <StatCard key={item.label} item={item} />
        ))}
      </SimpleGrid>

      <Card p={6}>
        <SectionHeader title="Recent Activity" subtitle="Latest updates from your properties" center={false} mb={4} />
        <VStack divider={<Box h="1px" bg="gray.200" />} spacing={0} align="stretch">
          {mockActivity.map((item, index) => (
            <ActivityItem key={index} item={item} />
          ))}
        </VStack>
        <Flex justify="flex-end" mt={4}>
          <Button size="sm" variant="outline" onClick={() => router.push('/activity')}>
            View All Activity
          </Button>
        </Flex>
      </Card>
    </PageContainer>
  );
}
