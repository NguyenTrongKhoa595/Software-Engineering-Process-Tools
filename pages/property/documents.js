import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
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
  Tag,
  TagLabel,
  IconButton,
  Divider,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FiSearch,
  FiPlus,
  FiDownload,
  FiEye,
  FiMoreVertical,
  FiFolder,
  FiX,
} from "react-icons/fi";
import HeaderLogo from "../../components/HeaderLogo";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

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

export default function PropertyDocumentsPage() {
  const router = useRouter();
  const { id: propertyId } = router.query;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState("");
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  // Fetch documents for this property
  useEffect(() => {
    if (!propertyId) return;

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/properties/${propertyId}/documents`
        );
        if (!res.ok) throw new Error("Failed to load documents");
        const data = await res.json();
        setDocs(data);
        if (data.length > 0) setSelectedDoc(data[0]);
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

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !propertyId) return;

    // Validate file type - only PDF or images
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        status: "error",
        title: "Invalid file type",
        description: "Only PDF and image files are allowed (PNG, JPG, GIF, WebP)",
      });
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API_BASE}/properties/${propertyId}/documents`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      setDocs((prev) => [...prev, saved]);
      setSelectedDoc(saved);
      toast({ status: "success", title: "Document uploaded" });
    } catch (e) {
      console.error(e);
      toast({ status: "error", title: "Upload failed" });
    } finally {
      setUploading(false);
      // reset input
      event.target.value = "";
    }
  };

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

  const openAccessModal = () => {
    setShareEmail("");
    setIsAccessModalOpen(true);
  };

  const handleShare = async () => {
    if (!selectedDoc || !shareEmail) return;
    try {
      const res = await fetch(`${API_BASE}/documents/${selectedDoc.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shareEmail }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({
        status: "success",
        title: "Access updated",
        description: `Shared with ${shareEmail}`,
      });
      setIsAccessModalOpen(false);
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to update access",
      });
    }
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

            <Box>
              <input
                id="upload-input"
                type="file"
                accept="application/pdf,image/*"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={() =>
                  typeof document !== 'undefined' && document.getElementById("upload-input")?.click()
                }
                isLoading={uploading}
              >
                New
              </Button>
            </Box>
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

              {/* Who has access */}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAccessModal}
                >
                  Manage access
                </Button>
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

      {/* Manage access modal */}
      <Modal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage access</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedDoc && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="xs" mb={1}>
                    Current access
                  </Text>
                  <HStack spacing={2} wrap="wrap">
                    <Tag size="sm" borderRadius="full" colorScheme="purple">
                      <Avatar
                        size="xs"
                        name={selectedDoc.ownerName}
                        mr={1}
                      />
                      <TagLabel>{selectedDoc.ownerName} (Owner)</TagLabel>
                    </Tag>
                    {(selectedDoc.sharedWith || []).map((u) => (
                      <Tag
                        key={u.id || u.name}
                        size="sm"
                        borderRadius="full"
                        colorScheme="blue"
                      >
                        <Avatar size="xs" name={u.name} mr={1} />
                        <TagLabel>{u.name}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </Box>

                <FormControl>
                  <FormLabel fontSize="xs">
                    Share with (email or user)
                  </FormLabel>
                  <Input
                    size="sm"
                    placeholder="tenant@example.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              variant="ghost"
              onClick={() => setIsAccessModalOpen(false)}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleShare}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
