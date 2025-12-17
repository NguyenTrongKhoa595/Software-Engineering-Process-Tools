import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  IconButton,
  Divider,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiMoreVertical,
  FiFolder,
  FiX,
} from "react-icons/fi";
import HeaderLogo from "../../../components/HeaderLogo";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Mock documents data for tenant view
const mockTenantDocuments = [
  {
    id: 1,
    name: "Lease_Agreement_2025.pdf",
    type: "PDF",
    createdAt: "2025-01-15T10:30:00Z",
    ownerName: "Property Manager",
    lastModifiedRelative: "2 days ago",
    modifiedAt: "2025-12-11T14:20:00Z",
    modifiedBy: "Property Manager",
    sizeBytes: 2457600, // 2.4 MB
    location: "Property Documents > Leases",
    sharedWith: [
      { id: 1, name: "You (Tenant)" }
    ]
  },
  {
    id: 2,
    name: "Move_In_Checklist.pdf",
    type: "PDF",
    createdAt: "2025-01-20T09:15:00Z",
    ownerName: "Property Manager",
    lastModifiedRelative: "1 month ago",
    modifiedAt: "2025-11-13T11:45:00Z",
    modifiedBy: "Property Manager",
    sizeBytes: 512000, // 500 KB
    location: "Property Documents > Checklists",
    sharedWith: []
  },
  {
    id: 3,
    name: "House_Rules.pdf",
    type: "PDF",
    createdAt: "2025-01-15T08:00:00Z",
    ownerName: "Landlord",
    lastModifiedRelative: "1 month ago",
    modifiedAt: "2025-11-15T16:30:00Z",
    modifiedBy: "Landlord",
    sizeBytes: 358400, // 350 KB
    location: "Property Documents > Rules",
    sharedWith: [
      { id: 1, name: "All Tenants" }
    ]
  },
  {
    id: 4,
    name: "Parking_Pass.pdf",
    type: "PDF",
    createdAt: "2025-02-01T13:20:00Z",
    ownerName: "Property Manager",
    lastModifiedRelative: "2 weeks ago",
    modifiedAt: "2025-11-29T10:15:00Z",
    modifiedBy: "Property Manager",
    sizeBytes: 204800, // 200 KB
    location: "Property Documents > Passes",
    sharedWith: []
  },
  {
    id: 5,
    name: "Property_Floor_Plan.png",
    type: "Image",
    createdAt: "2025-01-10T15:45:00Z",
    ownerName: "Landlord",
    lastModifiedRelative: "2 months ago",
    modifiedAt: "2025-10-10T09:00:00Z",
    modifiedBy: "Landlord",
    sizeBytes: 2097152, // 2 MB
    location: "Property Documents > Plans",
    sharedWith: [
      { id: 1, name: "You (Tenant)" }
    ]
  }
];

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

export default function TenantPropertyDocumentsPage() {
  const router = useRouter();
  const { id: propertyId } = router.query;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch documents for this property
  useEffect(() => {
    if (!propertyId) return;

    const fetchDocs = async () => {
      setLoading(true);
      try {
        // Use mock data for testing
        setDocs(mockTenantDocuments);
        if (mockTenantDocuments.length > 0) setSelectedDoc(mockTenantDocuments[0]);
        
        // Uncomment to use real API
        // const res = await fetch(
        //   `${API_BASE}/properties/${propertyId}/documents`
        // );
        // if (!res.ok) throw new Error("Failed to load documents");
        // const data = await res.json();
        // setDocs(data);
        // if (data.length > 0) setSelectedDoc(data[0]);
      } catch (e) {
        console.error(e);
        toast({
          status: "error",
          title: "Unable to load documents",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [propertyId, toast]);

  const filteredDocs = useMemo(() => {
    if (!search) return docs;
    return docs.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [docs, search]);

  const handleDownload = (doc) => {
    if (!doc) return;
    const link = typeof document !== 'undefined' && document.createElement("a");
    if (link) {
      link.href = `${API_BASE}/documents/${doc.id}/download`;
      link.download = doc.name;
      link.click();
    }
  };

  const handleView = (doc) => {
    if (!doc) return;
    const url = doc.previewUrl || `${API_BASE}/documents/${doc.id}/download`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <Flex minH="100vh" bg="gray.50" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <HeaderLogo />

      {/* Main layout */}
      <Flex
        flex="1"
        maxW="1200px"
        mx="auto"
        mb={10}
        px={4}
        gap={8}
        align="flex-start"
      >
        {/* Left: table and controls */}
        <Box flex="1" bg="white" rounded="2xl" boxShadow="xl" p={6}>
          {/* Top controls */}
          <HStack justify="space-between" mb={6}>
            <InputGroup maxW="500px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="gray.50"
              />
            </InputGroup>
          </HStack>

          {/* Table */}
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Asset Name</Th>
                <Th>Type</Th>
                <Th>Created</Th>
                <Th>Owner</Th>
                <Th>Last Modified</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDocs.map((doc) => (
                <Tr
                  key={doc.id}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                  bg={
                    selectedDoc && selectedDoc.id === doc.id
                      ? "blue.50"
                      : "transparent"
                  }
                  onClick={() => setSelectedDoc(doc)}
                >
                  <Td>
                    <HStack spacing={2}>
                      <Icon as={FiFolder} />
                      <Text fontSize="sm">{doc.name}</Text>
                    </HStack>
                  </Td>
                  <Td>{doc.type || "PDF"}</Td>
                  <Td>{formatDate(doc.createdAt)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Avatar
                        size="xs"
                        name={doc.ownerName}
                        bg="purple.500"
                        color="white"
                      />
                      <Text fontSize="sm">{doc.ownerName}</Text>
                    </HStack>
                  </Td>
                  <Td>{doc.lastModifiedRelative || "-"}</Td>
                  <Td textAlign="right">
                    <HStack spacing={1} justify="flex-end">
                      <IconButton
                        aria-label="Download"
                        icon={<FiDownload />}
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(doc);
                        }}
                      />
                      <IconButton
                        aria-label="View"
                        icon={<FiEye />}
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(doc);
                        }}
                      />
                      <IconButton
                        aria-label="More"
                        icon={<FiMoreVertical />}
                        size="sm"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Divider mt={6} />
        </Box>

        {/* Right: details panel */}
        <Box
          w={{ base: "0", md: "320px" }}
          display={{ base: "none", md: "block" }}
          bg="white"
          rounded="2xl"
          boxShadow="xl"
          p={6}
        >
          {selectedDoc ? (
            <VStack align="stretch" spacing={5}>
              {/* Header */}
              <HStack justify="space-between">
                <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                  {selectedDoc.name}
                </Text>
                <IconButton
                  aria-label="Close"
                  icon={<FiX />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedDoc(null)}
                />
              </HStack>

              <Divider />

              {/* Who has access (read-only for tenant) */}
              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={2}>
                  Who has access
                </Text>
                <HStack spacing={2} mb={3}>
                  {/* Owner */}
                  <Avatar
                    size="xs"
                    name={selectedDoc.ownerName}
                    bg="purple.500"
                    color="white"
                  />
                  {/* Example: sharedWith list */}
                  {(selectedDoc.sharedWith || []).slice(0, 3).map((u) => (
                    <Avatar
                      key={u.id || u.name}
                      size="xs"
                      name={u.name}
                      bg="blue.500"
                      color="white"
                    />
                  ))}
                </HStack>
              </Box>

              <Divider />

              {/* File details */}
              <Box>
                <Text fontSize="xs" fontWeight="semibold" mb={2}>
                  File details
                </Text>

                <VStack align="stretch" spacing={1} fontSize="xs">
                  <Text fontWeight="semibold" mt={2}>
                    Location
                  </Text>
                  <Text color="gray.600">
                    {selectedDoc.location || "Unknown"}
                  </Text>

                  <Text fontWeight="semibold" mt={2}>
                    Type
                  </Text>
                  <Text color="gray.600">{selectedDoc.type || "PDF"}</Text>

                  <Text fontWeight="semibold" mt={2}>
                    Size
                  </Text>
                  <Text color="gray.600">
                    {formatSize(selectedDoc.sizeBytes)}
                  </Text>

                  <Text fontWeight="semibold" mt={2}>
                    Owner
                  </Text>
                  <HStack spacing={2}>
                    <Avatar
                      size="xs"
                      name={selectedDoc.ownerName}
                      bg="purple.500"
                      color="white"
                    />
                    <Text color="gray.600">{selectedDoc.ownerName}</Text>
                  </HStack>

                  <Text fontWeight="semibold" mt={2}>
                    Modified
                  </Text>
                  <Text color="gray.600">
                    {formatDate(selectedDoc.modifiedAt)}{" "}
                    {selectedDoc.modifiedBy &&
                      `by ${selectedDoc.modifiedBy}`}
                  </Text>

                  <Text fontWeight="semibold" mt={2}>
                    Created
                  </Text>
                  <Text color="gray.600">
                    {formatDate(selectedDoc.createdAt)}{" "}
                    {selectedDoc.ownerName &&
                      `by ${selectedDoc.ownerName}`}
                  </Text>
                </VStack>
              </Box>
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.400">
              Select a document to see details.
            </Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
