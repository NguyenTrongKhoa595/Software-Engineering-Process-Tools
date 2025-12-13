// pages/payments.js
import { useState, useEffect } from "react";
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
  Avatar,
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
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
// Removed HeaderLogo per request

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // Form state for new/edit payment
  const [formData, setFormData] = useState({
    label: "",
    amount: "",
    tenantId: "",
    payDate: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/payments`);
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data);
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to load payments",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paymentId) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      const res = await fetch(`${API_BASE}/payments/${paymentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete payment");
      
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      toast({
        status: "success",
        title: "Payment deleted",
      });
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to delete payment",
      });
    }
  };

  const handleOpenNew = () => {
    setFormData({
      label: "",
      amount: "",
      tenantId: "",
      payDate: "",
    });
    setSelectedPayment(null);
    onOpen();
  };

  const handleOpenEdit = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      label: payment.label || "",
      amount: payment.amount || "",
      status: payment.status || "Pending",
      tenantId: payment.tenant?.id || "",
      payDate: payment.payDate || "",
    });
    onEditOpen();
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const res = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create payment");
      const newPayment = await res.json();
      
      setPayments((prev) => [...prev, newPayment]);
      toast({
        status: "success",
        title: "Payment created",
      });
      onClose();
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to create payment",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedPayment) return;

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const res = await fetch(`${API_BASE}/payments/${selectedPayment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update payment");
      const updated = await res.json();
      
      setPayments((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      toast({
        status: "success",
        title: "Payment updated",
      });
      onEditClose();
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to update payment",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box minH="100vh" bg="gray.50">

      {/* Main Content */}
      <Box maxW="1400px" mx="auto" p={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <HStack spacing={3}>
            <Heading size="lg">Payments</Heading>
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} rounded="full">
              {payments.length} transactions
            </Badge>
          </HStack>
          <Button colorScheme="blue" onClick={handleOpenNew}>
            New Payment
          </Button>
        </Flex>

        {/* Payments Table */}
        <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Label</Th>
                <Th>Amount</Th>
                <Th>Bill Number</Th>
                <Th>Status</Th>
                <Th>Tenant</Th>
                <Th>Pay Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    Loading...
                  </Td>
                </Tr>
              ) : payments.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    No payments found
                  </Td>
                </Tr>
              ) : (
                payments.map((payment) => (
                  <Tr key={payment.id} _hover={{ bg: "gray.50" }}>
                    <Td fontWeight="medium">{payment.label}</Td>
                    <Td>{payment.amount?.toLocaleString()}</Td>
                    <Td color="gray.600">{payment.billNumber}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          payment.status === "Paid" ? "green" : "orange"
                        }
                        px={3}
                        py={1}
                        rounded="full"
                      >
                        {payment.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Avatar
                          size="sm"
                          name={payment.tenant?.name || "Tenant"}
                          bg="red.500"
                        />
                        <Text>{payment.tenant?.name || "N/A"}</Text>
                      </HStack>
                    </Td>
                    <Td color="gray.600">{formatDate(payment.payDate)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Delete payment"
                          icon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(payment.id)}
                        />
                        <IconButton
                          aria-label="Edit payment"
                          icon={<FiEdit2 />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleOpenEdit(payment)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* New Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Label</FormLabel>
              <Input
                placeholder="e.g., Monthly Payout"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                placeholder="e.g., 54000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Tenant ID</FormLabel>
              <Input
                placeholder="Tenant ID"
                value={formData.tenantId}
                onChange={(e) =>
                  setFormData({ ...formData, tenantId: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Pay Date</FormLabel>
              <Input
                type="date"
                value={formData.payDate}
                onChange={(e) =>
                  setFormData({ ...formData, payDate: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Payment Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Label</FormLabel>
              <Input
                placeholder="e.g., Monthly Payout"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                placeholder="e.g., 54000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Tenant ID</FormLabel>
              <Input
                placeholder="Tenant ID"
                value={formData.tenantId}
                onChange={(e) =>
                  setFormData({ ...formData, tenantId: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Pay Date</FormLabel>
              <Input
                type="date"
                value={formData.payDate}
                onChange={(e) =>
                  setFormData({ ...formData, payDate: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdate}>
              Update Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
