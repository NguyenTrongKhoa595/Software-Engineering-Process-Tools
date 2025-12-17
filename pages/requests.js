import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Badge,
  HStack,
  Text,
  IconButton,
  useDisclosure,
  VStack,
  SimpleGrid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { FiTrash2, FiCheckCircle, FiEye, FiPlus } from 'react-icons/fi';
import useRequireAuth from '../src/hooks/useRequireAuth';
import PageContainer from '../src/components/ui/PageContainer';
import Card from '../src/components/ui/Card';
import EmptyState from '../src/components/ui/EmptyState';

// --- Mock Data ---
const mockRequests = [
  { id: 1, description: 'Leaking faucet in the kitchen sink.', property: '123 Main St', tenant: 'John Doe', priority: 'High', status: 'Open', request_date: '2025-12-10', photos: ['https://images.unsplash.com/photo-1582582494705-f8ce0b0c2469?w=400'] },
  { id: 2, description: 'Air conditioning unit is not cooling properly.', property: '456 Oak Ave', tenant: 'Jane Smith', priority: 'Medium', status: 'Open', request_date: '2025-12-08', photos: [] },
  { id: 3, description: 'Front door lock is jammed.', property: '789 Pine Rd', tenant: 'Ali Khan', priority: 'High', status: 'Resolved', request_date: '2025-12-05', resolved_date: '2025-12-06' },
];

// --- Skeleton Component ---
const RequestSkeleton = () => (
  <Card p={4}>
    <Flex justify="space-between" align="start">
      <VStack align="start">
        <Skeleton h="20px" w="250px" />
        <Skeleton h="16px" w="150px" />
      </VStack>
      <Skeleton h="24px" w="80px" borderRadius="full" />
    </Flex>
    <HStack mt={4} justify="space-between">
      <Skeleton h="14px" w="100px" />
      <Skeleton h="14px" w="120px" />
    </HStack>
  </Card>
);

// --- Sub-components ---
const RequestCard = ({ req, onOpenPhotos }) => {
  const priorityColor = req.priority === 'High' ? 'red' : req.priority === 'Medium' ? 'orange' : 'blue';
  const statusColor = req.status === 'Resolved' ? 'green' : 'orange';

  return (
    <Card p={4}>
      <Flex justify="space-between" align="start">
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" noOfLines={2}>{req.description}</Text>
          <Text fontSize="sm" color="gray.500">For: {req.property}</Text>
        </VStack>
        <HStack>
          <Badge colorScheme={priorityColor}>{req.priority}</Badge>
          <Badge colorScheme={statusColor}>{req.status}</Badge>
        </HStack>
      </Flex>
      <Divider my={3} />
      <Flex justify="space-between" align="center">
        <Text fontSize="xs" color="gray.500">Tenant: {req.tenant}</Text>
        <HStack>
          {req.photos?.length > 0 && (
            <IconButton icon={<FiEye />} size="sm" variant="ghost" aria-label="View Photos" onClick={() => onOpenPhotos(req)} />
          )}
          <IconButton icon={<FiCheckCircle />} size="sm" variant="ghost" colorScheme="green" aria-label="Mark Resolved" />
          <IconButton icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" aria-label="Delete" />
        </HStack>
      </Flex>
    </Card>
  );
};

// --- Main Page Component ---
export default function MaintenanceRequestsPage() {
  const canRender = useRequireAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenPhotos = (req) => {
    setSelected(req);
    onOpen();
  };

  if (!canRender) return null;

  return (
    <PageContainer>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Maintenance Requests</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue">New Request</Button>
      </Flex>

      {loading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(3)].map((_, i) => <RequestSkeleton key={i} />)}
        </VStack>
      ) : requests.length === 0 ? (
        <Card p={10}>
          <EmptyState title="No Maintenance Requests" description="All issues are resolved. Great job!" />
        </Card>
      ) : (
        <VStack spacing={4} align="stretch">
          {requests.map((req) => (
            <RequestCard key={req.id} req={req} onOpenPhotos={handleOpenPhotos} />
          ))}
        </VStack>
      )}

      <PhotosModal isOpen={isOpen} onClose={onClose} request={selected} />
    </PageContainer>
  );
}

// --- Modal Component ---
const PhotosModal = ({ isOpen, onClose, request }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Photos for: {request?.description}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {request?.photos?.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {request.photos.map((url, i) => (
              <Image key={i} src={url} alt={`Request photo ${i + 1}`} borderRadius="md" />
            ))}
          </SimpleGrid>
        ) : (
          <Text>No photos were submitted for this request.</Text>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
