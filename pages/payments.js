import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
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
  useDisclosure,
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import useRequireAuth from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
// import { apiGet, apiPost } from '@/utils/apiClient'; // Commented out for mock data
import PageContainer from '@/components/ui/PageContainer';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

// --- Mock Data ---
const mockPayments = [
  { id: 1, description: 'Monthly Rent - Dec 2025', amount: 2500, status: 'COMPLETED', paymentDate: '2025-12-01', payer: { fullName: 'John Doe' } },
  { id: 2, description: 'Security Deposit', amount: 1250, status: 'COMPLETED', paymentDate: '2025-11-15', payer: { fullName: 'John Doe' } },
  { id: 3, description: 'Monthly Rent - Nov 2025', amount: 2500, status: 'COMPLETED', paymentDate: '2025-11-01', payer: { fullName: 'John Doe' } },
  { id: 4, description: 'Late Fee - Oct 2025', amount: 50, status: 'PENDING', paymentDate: '2025-10-31', payer: { fullName: 'John Doe' } },
];

// --- Skeleton Component ---
const PaymentsSkeleton = () => (
  <Card p={6}>
    <Skeleton h="20px" w="150px" mb={6} />
    <VStack spacing={3} align="stretch">
      {[...Array(4)].map((_, i) => (
        <Flex key={i} justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
          <HStack>
            <SkeletonCircle size="10" />
            <VStack align="start">
              <Skeleton h="16px" w="200px" />
              <Skeleton h="12px" w="100px" />
            </VStack>
          </HStack>
          <Skeleton h="20px" w="80px" />
        </Flex>
      ))}
    </VStack>
  </Card>
);

// --- Main Page Component ---
export default function PaymentsPage() {
  const canRender = useRequireAuth();
  const router = useRouter();
  const toast = useToast();
  const { role } = useAuth();
  const { leaseId } = router.query;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setLoading(true);
    // --- MOCK DATA LOGIC ---
    setTimeout(() => {
      setPayments(leaseId ? mockPayments : []);
      setLoading(false);
    }, 1000);

    // --- API LOGIC (COMMENTED OUT) ---
    // if (!leaseId) {
    //   setLoading(false);
    //   setPayments([]);
    //   return;
    // }
    // const fetchPayments = async () => {
    //   setLoading(true);
    //   try {
    //     const data = await apiGet(`/payments/lease/${leaseId}`);
    //     setPayments(Array.isArray(data) ? data : []);
    //   } catch (err) {
    //     toast({ status: 'error', title: 'Failed to load payments', description: err.message });
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPayments();
  }, [leaseId, toast]);

  const handleNewPayment = (formData) => {
    // --- MOCK SAVE LOGIC ---
    const newPayment = {
      id: Math.random(),
      description: formData.description,
      amount: parseFloat(formData.amount || 0),
      paymentDate: formData.paymentDate,
      status: 'COMPLETED',
      payer: { fullName: 'Current User' },
    };
    setPayments(prev => [newPayment, ...prev]);
    toast({ status: 'success', title: 'Payment created (mock)' });
    onClose();

    // --- API LOGIC (COMMENTED OUT) ---
    // if (!leaseId) return;
    // try {
    //   const payload = {
    //     amount: parseFloat(formData.amount || 0),
    //     paymentDate: formData.paymentDate || null,
    //     type: formData.type || 'RENT',
    //     paymentMethod: 'Online Portal',
    //     description: formData.description || '',
    //   };
    //   const endpoint = role === 'TENANT' ? `/payments/lease/${leaseId}/pay` : `/payments/lease/${leaseId}`;
    //   const newPayment = await apiPost(endpoint, payload);
    //   setPayments((prev) => [newPayment, ...prev]);
    //   toast({ status: 'success', title: 'Payment created' });
    //   onClose();
    // } catch (err) {
    //   toast({ status: 'error', title: 'Failed to create payment', description: err.message });
    // }
  };

  if (!canRender) return null;

  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Payment History</Heading>
        <Button colorScheme="blue" onClick={onOpen} isDisabled={!leaseId}>
          Log a New Payment
        </Button>
      </Flex>

      {loading ? (
        <PaymentsSkeleton />
      ) : !leaseId ? (
        <Card p={10}>
          <EmptyState
            title="No Lease Selected"
            description="Please select a lease to view its payment history. You can do this by navigating from a property's detail page or by adding a '?leaseId=...' to the URL."
          />
        </Card>
      ) : payments.length === 0 ? (
        <Card p={10}>
          <EmptyState title="No Payments Found" description="There are no payment records for this lease yet." />
        </Card>
      ) : (
        <Card overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th isNumeric>Amount</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Payer</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((p) => (
                <Tr key={p.id}>
                  <Td fontWeight="medium">{p.description}</Td>
                  <Td isNumeric>${p.amount.toLocaleString()}</Td>
                  <Td><Badge colorScheme={p.status === 'COMPLETED' ? 'green' : 'orange'}>{p.status}</Badge></Td>
                  <Td>{new Date(p.paymentDate).toLocaleDateString()}</Td>
                  <Td>{p.payer?.fullName || 'N/A'}</Td>
                  <Td>
                    <IconButton icon={<FiEdit2 />} variant="ghost" size="sm" aria-label="Edit" />
                    <IconButton icon={<FiTrash2 />} variant="ghost" size="sm" colorScheme="red" aria-label="Delete" />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      )}

      <PaymentModal isOpen={isOpen} onClose={onClose} onSubmit={handleNewPayment} />
    </PageContainer>
  );
}

// --- Modal Component ---
const PaymentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({}); // Reset form
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Log a New Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input name="description" onChange={handleChange} placeholder="e.g., Monthly Rent - January" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <Input name="amount" type="number" onChange={handleChange} placeholder="2500.00" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Payment Date</FormLabel>
              <Input name="paymentDate" type="date" onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Payment Type</FormLabel>
              <Select name="type" onChange={handleChange} placeholder="Select type">
                <option value="RENT">Rent</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="LATE_FEE">Late Fee</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSubmit}>Save Payment</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
