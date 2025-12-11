// pages/profile/[id]/documents.js
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  VStack,
  HStack,
  useToast,
  Image,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import {
  FiUploadCloud,
  FiDownload,
  FiEye,
  FiTrash2,
  FiShare2,
} from "react-icons/fi";
import HeaderLogo from "../../../components/HeaderLogo";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// how each card maps to backend DocumentType
const SLOTS = [
  {
    key: "ID_CARD",
    label: "Personal ID *",
    backendType: "ID_CARD",
    required: true,
  },
  {
    key: "FINANCIAL",
    label: "Financial/Income Proof *",
    backendType: "INVOICE", // reuse your existing enum
    required: true,
  },
  {
    key: "RENTAL",
    label: "Rental Verification Documents *",
    backendType: "LEASE",
    required: true,
  },
  { key: "OTHER1", label: "Other Personal File 1", backendType: "OTHER" },
  { key: "OTHER2", label: "Other Personal File 2", backendType: "OTHER" },
  { key: "OTHER3", label: "Other Personal File 3", backendType: "OTHER" },
  { key: "OTHER4", label: "Other Personal File 4", backendType: "OTHER" },
  { key: "OTHER5", label: "Other Personal File 5", backendType: "OTHER" },
];

function isImageFile(fileName = "") {
  return /\.(png|jpe?g|gif|webp)$/i.test(fileName);
}

function UploadCard({
  slot,
  document,
  onSelectFile,
  onView,
  onDownload,
  onDelete,
  onShare,
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
  };

  const fileInputId = `file-input-${slot.key}`;

  return (
    <VStack align="stretch" spacing={2}>
      <Text fontSize="xs" color="gray.700">
        {slot.label}
        {slot.required && (
          <Text as="span" color="red.400">
            {" "}
            *
          </Text>
        )}
      </Text>

      <Box
        borderWidth="1px"
        borderStyle="dashed"
        borderColor={dragOver ? "blue.400" : "gray.300"}
        rounded="lg"
        minH="180px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        position="relative"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={handleDrop}
      >
        {!document ? (
          <VStack spacing={3}>
            <FiUploadCloud size={32} color="#3182CE" />
            <Text fontSize="sm" color="gray.600">
              Drag and Drop here
            </Text>
            <Text fontSize="xs" color="gray.400">
              or
            </Text>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => document.getElementById(fileInputId)?.click()}
            >
              Select file
            </Button>
            <input
              id={fileInputId}
              type="file"
              accept="image/*,application/pdf"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
          </VStack>
        ) : (
          <VStack spacing={2}>
            {isImageFile(document.fileName) ? (
              <Image
                src={document.previewUrl}
                alt={document.fileName}
                maxH="120px"
                maxW="160px"
                objectFit="cover"
                rounded="md"
              />
            ) : (
              <VStack spacing={1}>
                <Box
                  w="60px"
                  h="70px"
                  borderWidth="1px"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="white"
                >
                  <Text fontSize="xs" fontWeight="bold">
                    PDF
                  </Text>
                </Box>
                <Text fontSize="xs" noOfLines={1} maxW="140px">
                  {document.fileName}
                </Text>
              </VStack>
            )}
          </VStack>
        )}
      </Box>

      {document && (
        <HStack spacing={4} justify="center" pt={1}>
          <IconButton
            aria-label="Download"
            icon={<FiDownload />}
            size="sm"
            variant="ghost"
            onClick={onDownload}
          />
          <IconButton
            aria-label="View"
            icon={<FiEye />}
            size="sm"
            variant="ghost"
            onClick={onView}
          />
          <IconButton
            aria-label="Delete"
            icon={<FiTrash2 />}
            size="sm"
            variant="ghost"
            onClick={onDelete}
          />
          <IconButton
            aria-label="Share"
            icon={<FiShare2 />}
            size="sm"
            variant="ghost"
            onClick={onShare}
          />
        </HStack>
      )}
    </VStack>
  );
}

export default function PersonalDocumentsPage() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [docsBySlot, setDocsBySlot] = useState({}); // {slotKey: {id,fileName,previewUrl}}

  const fetchDocuments = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/${id}/documents`);
      if (!res.ok) throw new Error("Failed to load documents");
      const data = await res.json(); // expect array

      const mapped = {};
      const byType = (type) => data.filter((d) => d.fileType === type);

      const idCard = byType("ID_CARD")[0];
      if (idCard)
        mapped.ID_CARD = {
          id: idCard.id,
          fileName: idCard.fileName,
          previewUrl: idCard.downloadUrl,
        };

      const financial = byType("INVOICE")[0];
      if (financial)
        mapped.FINANCIAL = {
          id: financial.id,
          fileName: financial.fileName,
          previewUrl: financial.downloadUrl,
        };

      const rental = byType("LEASE")[0];
      if (rental)
        mapped.RENTAL = {
          id: rental.id,
          fileName: rental.fileName,
          previewUrl: rental.downloadUrl,
        };

      const others = byType("OTHER");
      ["OTHER1", "OTHER2", "OTHER3", "OTHER4", "OTHER5"].forEach(
        (slotKey, idx) => {
          const d = others[idx];
          if (d) {
            mapped[slotKey] = {
              id: d.id,
              fileName: d.fileName,
              previewUrl: d.downloadUrl,
            };
          }
        }
      );

      setDocsBySlot(mapped);
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to load personal documents",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadForSlot = async (slot, file) => {
    if (!id) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", slot.backendType);

    try {
      const res = await fetch(`${API_BASE}/users/${id}/documents`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();

      setDocsBySlot((prev) => ({
        ...prev,
        [slot.key]: {
          id: saved.id,
          fileName: saved.fileName,
          previewUrl: saved.downloadUrl,
        },
      }));

      toast({
        status: "success",
        title: "File uploaded",
      });
    } catch (e) {
      console.error("Upload failed", e);
      toast({
        status: "error",
        title: "Upload failed",
      });
    }
  };

  const deleteDocument = async (slotKey) => {
    const doc = docsBySlot[slotKey];
    if (!doc) return;
    if (!confirm("Delete this file?")) return;

    try {
      const res = await fetch(`${API_BASE}/documents/${doc.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setDocsBySlot((prev) => ({ ...prev, [slotKey]: undefined }));
      toast({ status: "success", title: "File deleted" });
    } catch (e) {
      console.error(e);
      toast({ status: "error", title: "Failed to delete file" });
    }
  };

  const viewDocument = (slotKey) => {
    const doc = docsBySlot[slotKey];
    if (!doc) return;
    window.open(doc.previewUrl, "_blank");
  };

  const downloadDocument = (slotKey) => {
    const doc = docsBySlot[slotKey];
    if (!doc) return;
    const a = document.createElement("a");
    a.href = `${API_BASE}/documents/${doc.id}/download`;
    a.download = doc.fileName;
    a.click();
  };

  const shareDocument = async (slotKey) => {
    const doc = docsBySlot[slotKey];
    if (!doc) return;
    const targetEmail = prompt("Share with user email:");
    if (!targetEmail) return;

    try {
      const res = await fetch(`${API_BASE}/documents/${doc.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({
        status: "success",
        title: "Document shared",
      });
    } catch (e) {
      console.error(e);
      toast({
        status: "error",
        title: "Failed to share document",
      });
    }
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      // you can add validation here (e.g. required slots must be filled)
      toast({
        status: "success",
        title: "Documents saved",
        description: "Your personal documents have been stored.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.50">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <HeaderLogo />

      {/* main card */}
      <Flex
        flex="1"
        maxW="1200px"
        mx="auto"
        mb={10}
        bg="white"
        rounded="3xl"
        boxShadow="2xl"
        p={10}
        direction="column"
      >
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={8}
          flex="1"
        >
          {SLOTS.map((slot) => (
            <UploadCard
              key={slot.key}
              slot={slot}
              document={docsBySlot[slot.key]}
              onSelectFile={(file) => uploadForSlot(slot, file)}
              onView={() => viewDocument(slot.key)}
              onDownload={() => downloadDocument(slot.key)}
              onDelete={() => deleteDocument(slot.key)}
              onShare={() => shareDocument(slot.key)}
            />
          ))}
        </Grid>

        <Flex justify="center" mt={10}>
          <Button
            colorScheme="blue"
            px={12}
            onClick={handleSubmitAll}
            isLoading={submitting}
          >
            Submit
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
