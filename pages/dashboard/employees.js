import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Avatar,
  HStack,
  Text,
  Badge,
  IconButton,
  useDisclosure,
  VStack,
  Skeleton,
  SkeletonCircle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';
import useRequireAuth from '@/hooks/useRequireAuth';
import PageContainer from '@/components/ui/PageContainer';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

// --- Mock Data ---
const mockEmployees = [
  { id: 1, name: 'Olivia Rhye', email: 'olivia@example.com', role: 'Property Manager', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: 2, name: 'Phoenix Baker', email: 'phoenix@example.com', role: 'Maintenance Staff', status: 'Active', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: 3, name: 'Lana Steiner', email: 'lana@example.com', role: 'Leasing Agent', status: 'Inactive', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100' },
];

// --- Skeleton Component ---
const EmployeeCardSkeleton = () => (
  <Card p={4}>
    <Flex justify="space-between" align="center">
      <HStack spacing={4}>
        <SkeletonCircle size="12" />
        <VStack align="start">
          <Skeleton h="20px" w="120px" />
          <Skeleton h="16px" w="180px" />
        </VStack>
      </HStack>
      <Skeleton h="24px" w="80px" borderRadius="full" />
    </Flex>
  </Card>
);

// --- Sub-components ---
const EmployeeCard = ({ employee, onEdit, onDelete }) => (
  <Card p={4}>
    <Flex justify="space-between" align="center">
      <HStack spacing={4}>
        <Avatar name={employee.name} src={employee.avatarUrl} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold">{employee.name}</Text>
          <Text fontSize="sm" color="gray.500">{employee.email}</Text>
        </VStack>
      </HStack>
      <HStack>
        <Badge colorScheme={employee.status === 'Active' ? 'green' : 'gray'}>{employee.status}</Badge>
        <IconButton icon={<FiEdit2 />} size="sm" variant="ghost" aria-label="Edit" onClick={() => onEdit(employee)} />
        <IconButton icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" aria-label="Delete" onClick={() => onDelete(employee.id)} />
      </HStack>
    </Flex>
  </Card>
);

// --- Main Page Component ---
export default function EmployeesPage() {
  const canRender = useRequireAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEmployees(mockEmployees);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenModal = (employee = null) => {
    setSelected(employee);
    onOpen();
  };

  if (!canRender) return null;

  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Employees</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => handleOpenModal()}>
          New Employee
        </Button>
      </Flex>

      {loading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(3)].map((_, i) => <EmployeeCardSkeleton key={i} />)}
        </VStack>
      ) : employees.length === 0 ? (
        <Card p={10}>
          <EmptyState title="No Employees Found" description="Get started by adding your first team member." />
        </Card>
      ) : (
        <VStack spacing={4} align="stretch">
          {employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onEdit={handleOpenModal} onDelete={() => {}} />
          ))}
        </VStack>
      )}

      <EmployeeModal isOpen={isOpen} onClose={onClose} employee={selected} />
    </PageContainer>
  );
}

// --- Modal Component ---
const EmployeeModal = ({ isOpen, onClose, employee }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{employee ? 'Edit Employee' : 'Add New Employee'}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input defaultValue={employee?.name} placeholder="John Doe" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" defaultValue={employee?.email} placeholder="john.doe@example.com" />
          </FormControl>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Input defaultValue={employee?.role} placeholder="e.g., Property Manager" />
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select defaultValue={employee?.status || 'Active'}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </FormControl>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
        <Button colorScheme="blue">{employee ? 'Save Changes' : 'Create Employee'}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
