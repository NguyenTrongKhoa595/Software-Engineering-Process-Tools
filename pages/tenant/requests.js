// pages/requests.js
import { useEffect, useState } from "react";
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
  HStack,
  Text,
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
  Select,
  Input,
  Image,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { FiTrash2, FiCheckCircle, FiEye } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";

export default function MaintenanceRequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filters, setFilters] = useState({ status: "", priority: "", from: "", to: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/maintenance-requests`);
      if (!res.ok) throw new Error("Failed to load maintenance requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      // No fallback sample data; keep empty on error
      setRequests([]);
      toast({ status: "error", title: "Failed to load maintenance requests" });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (items) => {
    return items.filter((r) => {
      if (filters.status && r.status !== filters.status) return false;
      if (filters.priority && r.priority !== filters.priority) return false;
      if (filters.from) {
        const rf = new Date(filters.from).getTime();
        const rr = r.request_date ? new Date(r.request_date).getTime() : 0;
        if (rr < rf) return false;
      }
      if (filters.to) {
        const rt = new Date(filters.to).getTime();
        const rr = r.request_date ? new Date(r.request_date).getTime() : 0;
        if (rr > rt) return false;
      }
      return true;
    });
  };

  const markResolved = async (req) => {
    try {
      const res = await fetch(`${API_BASE}/maintenance-requests/${req.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved", resolved_date: new Date().toISOString() }),
      });
      const updated = res.ok ? await res.json() : { ...req, status: "Resolved", resolved_date: new Date().toISOString() };
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast({ status: "success", title: "Request marked resolved" });
    } catch (e) {
      console.error(e);
      toast({ status: "error", title: "Failed to mark resolved" });
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm("Delete this maintenance request?")) return;
    try {
      const res = await fetch(`${API_BASE}/maintenance-requests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast({ status: "success", title: "Request deleted" });
    } catch (e) {
      console.error(e);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast({ status: "success", title: "Request deleted" });
    }
  };

  const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const priorityBadge = (p) => {
    const color = p === "High" ? "red" : p === "Medium" ? "orange" : "blue";
    return (
      <Badge colorScheme={color} px={3} py={1} rounded="full">{p || "Low"}</Badge>
    );
  };

  const statusBadge = (s) => {
    const map = { Open: "orange", Resolved: "green" };
    const color = map[s] || "gray";
    return (
      <Badge colorScheme={color} px={3} py={1} rounded="full">{s || "Open"}</Badge>
    );
  };

  const openPhotos = (req) => {
    setSelected(req);
    onOpen();
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="1400px" mx="auto" p={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <HStack spacing={3}>
            <Heading size="lg">Maintenance Requests</Heading>
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} rounded="full">
              {requests.length} requests
            </Badge>
          </HStack>
          <Button onClick={fetchRequests} colorScheme="blue">Refresh</Button>
        </Flex>

        {/* Filters */}
        <Box bg="white" rounded="md" borderWidth="1px" borderColor="gray.200" p={4} mb={4}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All</option>
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                <option value="">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>From Date</FormLabel>
              <Input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>To Date</FormLabel>
              <Input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Description</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>Property</Th>
                <Th>Tenant</Th>
                <Th>Request Date</Th>
                <Th>Resolved Date</Th>
                <Th>Photos</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={9} textAlign="center" py={8}>Loading...</Td>
                </Tr>
              ) : requests.length === 0 ? (
                <Tr>
                  <Td colSpan={9} textAlign="center" py={8}>No maintenance requests found</Td>
                </Tr>
              ) : (
                applyFilters(requests).map((req) => (
                  <Tr key={req.id} _hover={{ bg: "gray.50" }}>
                    <Td maxW="380px"><Text noOfLines={2}>{req.description}</Text></Td>
                    <Td>{priorityBadge(req.priority)}</Td>
                    <Td>{statusBadge(req.status)}</Td>
                    <Td>#{req.property_id}</Td>
                    <Td>
                      <HStack spacing={3} align="center">
                        {req.tenant_avatar ? (
                          <Image src={req.tenant_avatar} alt={req.tenant_name || `tenant-${req.tenant_id}`} boxSize="28px" rounded="full" objectFit="cover" />
                        ) : (
                          <Box w="28px" h="28px" rounded="full" bg="gray.200" />
                        )}
                        <Text fontWeight="medium">{req.tenant?.name || req.tenant_name || `#${req.tenant_id}`}</Text>
                      </HStack>
                    </Td>
                    <Td color="gray.600">{formatDate(req.request_date)}</Td>
                    <Td color="gray.600">{formatDate(req.resolved_date)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Badge colorScheme="purple" rounded="full" px={2}>{(req.photos?.length || 0)} files</Badge>
                        {req.photos?.length ? (
                          <IconButton aria-label="View photos" icon={<FiEye />} size="sm" variant="ghost" onClick={() => openPhotos(req)} />
                        ) : null}
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton aria-label="Mark resolved" icon={<FiCheckCircle />} size="sm" variant="ghost" colorScheme="green" onClick={() => markResolved(req)} />
                        <IconButton aria-label="Delete" icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => deleteRequest(req.id)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Photos Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Photos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected?.photos?.length ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {selected.photos.map((src, idx) => (
                  <Box key={idx} borderWidth="1px" borderColor="gray.200" rounded="md" overflow="hidden">
                    <Image src={src} alt={`photo-${idx}`} objectFit="cover" w="100%" h="200px" />
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Text>No photos</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
