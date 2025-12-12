// pages/employees.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  Avatar,
  HStack,
  Text,
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
  Checkbox,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api";

export default function EmployeesPage() {
  const toast = useToast();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "On Job",
    hireDate: "",
  });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/employees`);
      if (!res.ok) throw new Error("Failed to load employees");
      const data = await res.json();
      // Map any 'Pending' status to 'On Job' per requirement
      const normalized = Array.isArray(data)
        ? data.map((e) => ({
            ...e,
            status: e.status === "Pending" ? "On Job" : e.status,
          }))
        : [];
      setEmployees(normalized);
    } catch (e) {
      console.error(e);
      // Fallback demo data to visualize UI if API missing
      setEmployees([
        {
          id: 1,
          name: "Olivia Rhye",
          handle: "@olivia",
          email: "olivia@untitledui.com",
          status: "On Job",
          hireDate: "2022-01-06",
          role: "Manager",
          avatarColor: "purple.500",
        },
        {
          id: 2,
          name: "Phoenix Baker",
          handle: "@phoenix",
          email: "phoenix@untitledui.com",
          status: "Suspended",
          hireDate: "2022-01-06",
          role: "Manager",
          avatarColor: "orange.500",
        },
        {
          id: 3,
          name: "Lana Steiner",
          handle: "@lana",
          email: "lana@untitledui.com",
          status: "On Job",
          hireDate: "2022-01-06",
          role: "Manager",
          avatarColor: "pink.500",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setFormData({ name: "", email: "", status: "On Job", hireDate: "" });
    setSelected(null);
    onOpen();
  };

  const openEdit = (emp) => {
    setSelected(emp);
    setFormData({
      name: emp.name || "",
      email: emp.email || "",
      status: emp.status || "Pending",
      hireDate: emp.hireDate || "",
    });
    onEditOpen();
  };

  const createEmployee = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const created = res.ok ? await res.json() : { id: Date.now(), ...formData };
      setEmployees((prev) => [...prev, created]);
      toast({ status: "success", title: "Employee added" });
      onClose();
    } catch (e) {
      console.error(e);
      toast({ status: "error", title: "Failed to add employee" });
    }
  };

  const updateEmployee = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`${API_BASE}/employees/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updated = res.ok ? await res.json() : { ...selected, ...formData };
      setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      toast({ status: "success", title: "Employee updated" });
      onEditClose();
    } catch (e) {
      console.error(e);
      toast({ status: "error", title: "Failed to update employee" });
    }
  };

  const deleteEmployee = async (id) => {
    if (!confirm("Remove this employee?")) return;
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast({ status: "success", title: "Employee removed" });
    } catch (e) {
      console.error(e);
      // Optimistic removal if API missing
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast({ status: "success", title: "Employee removed" });
    }
  };

  const statusBadge = (status) => {
    const map = {
      "On Job": { color: "green", label: "On Job" },
      "Suspended": { color: "red", label: "Suspended" },
      // Pending removed
    };
    const meta = map[status] || { color: "gray", label: status };
    return (
      <Badge colorScheme={meta.color} px={3} py={1} rounded="full">
        {meta.label}
      </Badge>
    );
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* No logo/header per request */}
      <Box maxW="1200px" mx="auto" p={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Employees</Heading>
          <Button colorScheme="blue" onClick={openNew}>+ New</Button>
        </Flex>

        <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Email address</Th>
                <Th>Hired Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={8}>Loading...</Td>
                </Tr>
              ) : employees.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={8}>No employees</Td>
                </Tr>
              ) : (
                employees.map((emp) => (
                  <Tr key={emp.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar 
                          size="sm" 
                          name={emp.name} 
                          bg={emp.avatarColor || "gray.500"} 
                          cursor="pointer"
                          onClick={() => router.push(`/profile/${emp.id}`)}
                          _hover={{ opacity: 0.8 }}
                        />
                        <Box>
                          <Text fontWeight="medium">{emp.name}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>{statusBadge(emp.status)}</Td>
                    <Td color="gray.700">{emp.email}</Td>
                    <Td color="gray.600">{new Date(emp.hireDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton aria-label="Delete" icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => deleteEmployee(emp.id)} />
                        <IconButton aria-label="Edit" icon={<FiEdit2 />} size="sm" variant="ghost" colorScheme="blue" onClick={() => openEdit(emp)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* New Employee Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="On Job">On Job</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Hired Date</FormLabel>
              <Input type="date" value={formData.hireDate} onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={createEmployee}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="On Job">On Job</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Hired Date</FormLabel>
              <Input type="date" value={formData.hireDate} onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={updateEmployee}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
